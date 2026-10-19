
import { useState } from "react";
import { Link } from "@tanstack/react-router";

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
    name,
    price,
    duration,
    includes,
    onClose,
}: TPackage & { onClose: () => void }) {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_NUMBER_REGEX = /^[6-9]\d{9}$/;
    const [headCount, setHeadCount] = useState(1);
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");

    
    const handleFieldValueChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        switch (e.target.name) {
            case "headCount":
                setHeadCount(Number(e.target.value));
                break;

            case "email":
                setEmail(e.target.value);
                break;

            case "phoneNumber":
                if (isNaN(Number(e.target.value)) || e.target.value.length > 10) return;

                setPhoneNumber(e.target.value);
                break;

        }
    }


    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isNaN(headCount)) {
            setError("Headcount should be a number");
            return;
        }

        if (headCount <= 0) {
            setError("Headcount should not be a negetive number or 0");
            return;
        }

        if (!EMAIL_REGEX.test(email)) {
            setError("Enter a valid email");
            return;
        }

        if (PHONE_NUMBER_REGEX.test(phoneNumber)) {
            setError("Enter a valid Indian phone number");
            return
        }
        
        
    }

    return (
        <form onSubmit={handleSubmit} className="fixed h-screen w-screen inset-0 z-50 flex justify-center items-center bg-black/50">
            <div className="w-full max-w-md rounded-3xl border border-white/60 bg-[#f4f1e9] p-7 shadow-2xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="font-display text-xl font-semibold text-ink">
                            {name}
                        </h2>
                        <p className="mt-1 font-body text-xs text-ink/50">
                            {duration}
                        </p>
                    </div>

                    <button onClick={onClose} aria-label="Close modal">
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
                        htmlFor="headCount"
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
                        htmlFor="headCount"
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
                        Continue
                    </button>
                </div>
            </div>
        </form>
    );
}