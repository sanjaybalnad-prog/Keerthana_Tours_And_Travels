
import RazorpayCheckout from "@razorpay/razorpay-js/checkout";


interface OpenCheckoutOptions {
    orderId: string;
    name: string;
    email: string;
    phone: string;
    onSuccess: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) => void | Promise<void>;
    onFailure: (message: string) => void;
}

export async function openRazorpayCheckout({
    orderId,
    name,
    email,
    phone,
    onSuccess,
    onFailure,
}: OpenCheckoutOptions) {
    const checkout = await RazorpayCheckout({
        key: import.meta.env["VITE_RAZORPAY_KEY_ID"],
        order_id: orderId,
        name: "Keerthana Tours & Travels",
        prefill: { name, email, contact: phone },

        handler: async (response: any) => {
            try {
                await onSuccess(response);
            } catch (error) {
                onFailure(
                    error instanceof Error
                        ? error.message
                        : "Payment verification failed."
                );
            }
        },
    });

    checkout.on("payment.failed", (event) => {
        onFailure(event.error.description || "Payment failed.");
    });

    checkout.open();
}
