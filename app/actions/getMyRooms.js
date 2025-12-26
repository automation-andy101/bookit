'use server';

import { createSessionClient } from '/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';


async function getMyRooms() {
    noStore();

    const sessionCookies = cookies().get("appwrite-session");

    if (!sessionCookies) {
        redirect("/login");
    }

    try {
        const { account, databases } = await createSessionClient(sessionCookies.value);

        // Get user's ID
        const user = await account.get();
        const userId = user.$id;
        
        // Fetch rooms
        const { documents: rooms } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            [
                Query.equal("user_id", userId),
                Query.limit(100),
                Query.offset(0),
            ]
        );

        return rooms;

    } catch (error) {
        console.log('Failed to get users rooms', error);
        redirect('/error');
    }
}

export default getMyRooms;
