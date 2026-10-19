
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { paymentApi } from "@/features/payment.api";
import { toast } from "sonner";
import { openRazorpayCheckout } from "@/utils/razorpay.util";

export type TPackage = {
    id: number;
    name: string;
    duration: string;
    price: number;
    includes: string[];
};

export default function PackageBooking({
    id,
    name,
    price,
    duration,
    includes,
}: TPackage) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <article
                className="kt-glass flex flex-col rounded-3xl p-7 transition duration-500 hover:-translate-y-1.5"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="font-display text-xl font-semibold text-ink">
                            {name}
                        </h2>
                        <div className="mt-1 font-body text-xs text-ink/50">
                            {duration}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="font-body text-[10px] uppercase tracking-[0.15em] text-ink/45">
                            From
                        </div>
                        <div className="font-display text-lg font-semibold text-brand">
                            ₹{price.toLocaleString("en-IN")}
                        </div>
                    </div>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2">
                    {includes.map((item) => (
                        <li
                            key={item}
                            className="rounded-full bg-white/55 px-3 py-1 text-xs text-ink/65"
                        >
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto flex items-center justify-between">
                    <Link
                        to="/contact"
                        className="mt-6 w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                    >
                        Enquire
                    </Link>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="mt-6 w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                    >
                        Buy Now
                    </button>
                </div>
            </article>

            {isOpen && (
                <BookingModal
                    id={id}
                    name={name}
                    price={price}
                    duration={duration}
                    includes={includes}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}


function BookingModal({
    name: packageName,
    price,
    duration,
    includes,
    onClose,
}: TPackage & { onClose: () => void }) {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;;
    const PHONE_NUMBER_REGEX = /^[6-9]\d{9}$/;

    const [name, setName] = useState("");
    const [headCount, setHeadCount] = useState(1);
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");

    const handleFieldValueChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        switch (e.target.name) {
            case "name":
                setName(e.target.value);
                break;

            case "headCount":
                setHeadCount(Number(e.target.value));
                break;

            case "email":
                setEmail(e.target.value);
                break;

            case "phoneNumber":
                if (!/^\d{0,10}$/.test(e.target.value)) return;
                setPhoneNumber(e.target.value);
                break;

        }
    }


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        if (isNaN(headCount)) {
            setError("Headcount should be a number");
            return;
        }

        if (!Number.isInteger(headCount) || headCount < 1) {
            setError("Number of travellers must be a positive whole number");
            return;
        }

        if (!EMAIL_REGEX.test(email)) {
            setError("Enter a valid email");
            return;
        }

        if (!PHONE_NUMBER_REGEX.test(phoneNumber)) {
            setError("Enter a valid Indian phone number");
            return
        }

        setError("")
        // TODO: Create Order
        try {
            const { data: order } = await paymentApi.createOrder(price * headCount);
            openRazorpayCheckout({
                email,
                name,
                onFailure: handlePaymentFailure,
                onSuccess: handlePaymentSuccess,
                orderId: order.id,
                phone: phoneNumber

            })


        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
                return;
            }
            toast.error("Something went wrong");
            console.log(error);
        }

    }

     async function handlePaymentSuccess (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }){
        const res = await paymentApi.verifyPayment({
            name,
            email,
            packageName,
            phone:phoneNumber,
            price:price * headCount,
            quantity:headCount,
            razorpay_order_id:response.razorpay_order_id,
            razorpay_payment_id:response.razorpay_payment_id,
            razorpay_signature:response.razorpay_signature,
        })

        toast.success(res.message + " Our team will contact you soon !!!")
        onClose()
    }

    async function handlePaymentFailure (err:string){
        toast.error(err)
        onClose()
    }

    return (
        <form onSubmit={handleSubmit} className="fixed h-screen w-screen inset-0 z-50 flex justify-center items-center bg-black/50">
            <div className="w-full max-w-md rounded-3xl border border-white/60 bg-[#f4f1e9] p-7 shadow-2xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="font-display text-xl font-semibold text-ink">
                            {packageName}
                        </h2>
                        <p className="mt-1 font-body text-xs text-ink/50">
                            {duration}
                        </p>
                    </div>

                    <button type="button" onClick={onClose} aria-label="Close modal">
                        ✕
                    </button>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2">
                    {includes.map((item) => (
                        <li
                            key={item}
                            className="rounded-full bg-white/55 px-3 py-1 text-xs text-ink/65"
                        >
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="mt-6">

                    {/* Name */}
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-ink"
                    >
                        Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleFieldValueChange}
                        className="mt-2 w-full rounded-xl border border-ink/10 bg-white/60 p-3 text-ink outline-none"
                    />

                    {/* Quantity */}
                    <label
                        htmlFor="headCount"
                        className="text-sm font-medium text-ink"
                    >
                        Number of travellers
                    </label>

                    <input
                        id="headCount"
                        type="number"
                        name="headCount"
                        min={1}
                        value={headCount}
                        onChange={handleFieldValueChange}
                        className="mt-2 w-full rounded-xl border border-ink/10 bg-white/60 p-3 text-ink outline-none"
                    />

                    {/*  Email */}
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-ink"
                    >
                        Email for contact
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleFieldValueChange}
                        className="mt-2 w-full rounded-xl border border-ink/10 bg-white/60 p-3 text-ink outline-none"
                    />
                    {/* Phone number */}
                    <label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium text-ink"
                    >
                        Phone number for contact
                    </label>

                    <input
                        id="phoneNumber"
                        type="text"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={handleFieldValueChange}
                        className="mt-2 w-full rounded-xl border border-ink/10 bg-white/60 p-3 text-ink outline-none"
                    />
                </div>

                {error && <p className="text-red-800 m-5">{error}</p>}

                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-ink/50">
                            Total price
                        </p>
                        <p className="font-display text-2xl font-semibold text-brand">
                            ₹{(price * headCount).toLocaleString("en-IN")}
                        </p>
                    </div>


                    <button
                        type="submit"
                        className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                    >
                        Proceed to pay
                    </button>
                </div>
            </div>
        </form>
    );
}