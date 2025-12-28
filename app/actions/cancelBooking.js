'use server';

import { createSessionClient } from '/config/appwrite';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore , revalidatePath } from 'next/cache';
import checkAuth from './checkAuth';

async function cancelBooking(bookingId) {
    noStore();

    const sessionCookies = cookies().get("appwrite-session");

    if (!sessionCookies) {
        redirect("/login");
    }

    try {
        const { databases } = await createSessionClient(sessionCookies.value);

        // Get user's ID
        const { user } = await checkAuth();

        if (!user) {
            return {
                error: "You must be logged in to cancel a booking"
            };
        }

        // Get the booking
        const booking = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            bookingId
        );

        console.log("BOOB1");
        console.log(booking);
        console.log(user);

        // Check if booking belongs to current user
        if (booking.user_id !== user.id) {
            return {
                error: "You are not authorised to cancel this booking"
            };
        }

        console.log("BOOB2");
        console.log(bookingId);
        
        // Delete booking
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            bookingId
        );

        revalidatePath("/bookings", "layout");

        return {
            success: true
        };

    } catch (error) {
        console.log('Failed to cancel booking', error);
        return {
            error: "Failed to cancel booking"
        }
    }
}

export default cancelBooking;
