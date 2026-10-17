import { razorpay } from "../config/razorpay";
import { ApiError } from "../utils/ApiError";

export async function createOrder(req, res){
    const amount = Number(req.body.price);
    if(isNaN(amount)) throw new ApiError(400, "Price must be a number");

    const order = await razorpay.orders.create({
        amount:amount * 100,
        currency:"INR"
    });
    

    res.status(200).json({success:true, data:order});    
}

export async function verifyPayment(req, res){
    console.log(req.body)
    res.status(200).json({success:true, message:"Payment done"})
}