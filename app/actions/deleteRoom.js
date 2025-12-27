"use server";

import { createSessionClient } from '/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { revalidatePath } from "next/cache";

async function deleteRoom(roomId) {
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

        // Find room to delete
        const roomToDelete = rooms.find((room) => room.$id === roomId);

        if (roomToDelete) {
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
                roomToDelete.$id,
            );

            // Revalidate my rooms and all rooms
            revalidatePath("/rooms/my", "layout");
            revalidatePath("/", "layout");

            return {
                success: true
            };
        } else {
            error: "Room not found!"
        }

    } catch (error) {
        console.log("Failed to delete room!")

        return {
            error: "Failed to delete room!"
        }
    }
}

export default deleteRoom;