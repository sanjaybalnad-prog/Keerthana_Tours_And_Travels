import Razorpay from "razorpay";
import { env } from "./env.js";

export const razorpay = new Razorpay({
        key_id:env.razorPayApiKey,
        key_secret:env.razorPayApiSecret
});