"use server";

import { createAdminClient } from "/config/appwrite";
import checkAuth from "./checkAuth";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

async function editRoom(previousState, formData, id) {
    const { databases, storage } = await createAdminClient();

    try {
        const { user } = await checkAuth();

        if (!user) {
            return {
                error: "You must be logged in to edit a room"
            }
        }

        // Uploading image
        const roomId = formData.get("roomId");
        const existingImage = formData.get("existingImage");
        const image = formData.get("image");

        let imageId = existingImage;

        // Only upload if a NEW image was provided
        if (image && image.size > 0 && image.name !== "undefined") {
            try {
                const uploaded = await storage.createFile(
                    process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS,
                    ID.unique(), 
                    image
                );
                imageId = uploaded.$id;
            } catch (error) {
                console.log("Error uploading image", error);
                return {
                    error: "Error uploading image"
                }
            }
        }

        // Update room
        const editedRoom = await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            roomId,
            {
               user_id: user.id,
               name: formData.get('name'),
               description: formData.get('description'),
               sqft: formData.get('sqft'),
               capacity: formData.get('capacity'),
               location: formData.get('location'),
               address: formData.get('address'),
               availability: formData.get('availability'),
               price_per_hour: formData.get('price_per_hour'),
               amenities: formData.get('amenities'),
               image: imageId
            }
        );

        revalidatePath("/rooms/my");
        revalidatePath(`/rooms/edit/${roomId}`);

        return {
            success: true
        }

    } catch (error) {
        const errorMessage = error.response.message || "An unexpected error has occurred!";

        return {
            error: errorMessage
        }
    }
}

export default editRoom;