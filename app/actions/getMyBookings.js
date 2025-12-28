'use server';

import { createSessionClient } from '/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import checkAuth from './checkAuth';
import { unstable_noStore as noStore } from 'next/cache';


async function getMyBookings() {
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
                error: "You must be logged in to view your bookings."
            }
        }
        
        // Fetch users bookings
        const { documents: bookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            [
                Query.equal("user_id", user.id),
                Query.limit(100),
                Query.offset(0),
            ]
        );

        return bookings;

    } catch (error) {
        console.log('Failed to get users bookings', error);
        return {
            error: "Failed to get users bookings"
        }
    }
}

export default getMyBookings;
