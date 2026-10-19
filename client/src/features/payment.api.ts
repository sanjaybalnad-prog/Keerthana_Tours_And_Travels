
import { request } from "@/utils/api.util";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/types/api.types";

export const paymentApi = {
  async createOrder(price: number) {
    const body: CreateOrderRequest = { price };

    return request<CreateOrderResponse>("/api/payment/order", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async verifyPayment(details: VerifyPaymentRequest) {
    return request<VerifyPaymentResponse>("/api/payment/verify", {
      method: "POST",
      body: JSON.stringify(details),
    });
  },
};
