'use server';

import { createSessionClient } from '/config/appwrite';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import checkAuth from './checkAuth';


async function bookRoom(previousState, formData) {
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
                error: "You must be logged in to book a room."
            }
        }
    
        // Extract date and time from the formData
        const checkInDate = formData.get("check_in_date");
        const checkInTime = formData.get("check_in_time");
        const checkOutDate = formData.get("check_out_date");
        const checkOutTime = formData.get("check_out_time");

        // Combine date and time to ISO 8601 format
        const checkInDateTime = `${checkInDate}T${checkInTime}`;
        const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

        const bookingData = {
            check_in: checkInDateTime,
            check_out: checkOutDateTime,
            user_id: user.id,
            room_id: formData.get("room_id")
        }

        // Create booking
        const newBooking = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            ID.unique(),
            bookingData
        );

        // Revalidate cache
        revalidatePath("/bookings", "layout");

        return {
            sucess: true
        }

    } catch (error) {
        console.log('Failed to book room', error);
        
        return {
            error: "Something went wrong booking the room."
        }
    }
}

export default bookRoom;
