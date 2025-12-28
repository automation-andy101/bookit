"use client";

import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import cancelBooking from "/app/actions/cancelBooking";

const CancelBookingButton = ({ bookingId }) => {
    const handleCancelClick = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const result = await cancelBooking(bookingId);

            if (result.success) {
                toast.success("Booking cancelled successfully!");
            }
            
        } catch (error) {
            toast.error("Failed to cancelled booking!")
            return {
                error: "Failed to cancelled booking!"
            };
        }
    };

    return (
            <button
                onClick={handleCancelClick}
                className="bg-red-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-red-700"
            >
                <FaTrash className="inline mr-1" /> Cancel Booking
            </button>
    )
}

export default CancelBookingButton;