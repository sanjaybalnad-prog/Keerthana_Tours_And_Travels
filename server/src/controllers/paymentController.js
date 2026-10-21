import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { razorpay } from "../config/razorpay.js";
import { ApiError } from "../utils/ApiError.js";
import {env} from "../config/env.js"
import Lead from "../models/Lead.js";


export async function createOrder(req, res) {
    const { price } = req.body;

    if (
        price === undefined ||
        price === null ||
        price === "" ||
        typeof price === "boolean"
    ) {
        throw new ApiError(400, "Price is required");
    }

    const amount = Number(price);

    const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR"
    });


    res.status(200).json({ success: true, data: order });
}




export async function verifyPayment(req, res) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name,
    email,
    phone,
    packageName,
    quantity,
    price,
  } = req.body;

  // 1. Validate Razorpay identifiers
  if (
    typeof razorpay_order_id !== "string" ||
    !razorpay_order_id.trim() ||
    typeof razorpay_payment_id !== "string" ||
    !razorpay_payment_id.trim() ||
    typeof razorpay_signature !== "string" ||
    !razorpay_signature.trim()
  ) {
    throw new ApiError(400, "Invalid payment verification details");
  }

  // 2. Validate booking details
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof phone !== "string" ||
    !/^\+?[0-9]{10,15}$/.test(phone.trim()) ||
    typeof packageName !== "string" ||
    !packageName.trim() ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    throw new ApiError(400, "Invalid booking details");
  }

  // 3. Check whether this order has already been processed
  const existingLead = await Lead.findById(razorpay_order_id);

  if (existingLead) {
    throw new ApiError(409, "This order has already been processed");
  }

  // 4. Verify Razorpay signature
  try {
    validatePaymentVerification(
      {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      },
      razorpay_signature,
      env.razorPayApiSecret
    );
  } catch {
    throw new ApiError(400, "Invalid payment signature");
  }

  // 5. Fetch the actual payment from Razorpay
  const payment = await razorpay.payments.fetch(
    razorpay_payment_id
  );

  // Razorpay returns amounts in paise for INR
  const expectedAmountPaise = Math.round(price * 100);

  if (
    payment.order_id !== razorpay_order_id ||
    payment.status !== "captured" ||
    payment.amount !== expectedAmountPaise ||
    payment.currency !== "INR"
  ) {
    throw new ApiError(400, "Payment verification failed");
  }

  // 6. Create the Lead
  try {
    await Lead.create({
      _id: razorpay_order_id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      packageName: packageName.trim(),
      quantity,
      price,
      leadStatus: "unread",
      isDeleted: false,
    });
  } catch (error) {
    // Handles concurrent requests using the same order ID
    if (error?.code === 11000) {
      throw new ApiError(409, "This order has already been processed");
    }

    throw error;
  }

  // 7. Send success response
  return res.status(200).json({
    success: true,
    message: "Payment verified and booking recorded",
  });
}