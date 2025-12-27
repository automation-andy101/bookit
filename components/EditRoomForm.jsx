"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import editRoom from "/app/actions/editRoom";

const EditRoomForm = ({ room }) => {
    const [previewImage, setPreviewImage] = useState(null);

    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

    const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${room.image}/view?project=${projectId}`;
    const imageSrc = previewImage ? previewImage : room.image ? imageUrl : "/images/no-image.jpg";
    
    const [state, formAction] = useFormState(editRoom, {});
    const router = useRouter();

    useEffect(() => {
        if (state?.error) toast.error(state.error);

        if (state?.success) {
        toast.success("Room updated successfully!");
        router.push("/rooms/my");
        }
    }, [state, router]);
    
    return (
        <>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full">
                <form action={formAction}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                            Room Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Enter a name (Large Conference Room)"
                            defaultValue={room.name}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="border rounded w-full h-24 py-2 px-3"
                            placeholder="Enter a description for the room"
                            defaultValue={room.description}
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="sqft" className="block text-gray-700 font-bold mb-2">
                            Square Feet
                        </label>
                        <input
                            type="number"
                            id="sqft"
                            name="sqft"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Enter room size in ft"
                            defaultValue={room.sqft}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="capacity" className="block text-gray-700 font-bold mb-2">
                            Capacity
                        </label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Number of people the room can hold"
                            defaultValue={room.capacity}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="price_per_hour"
                            className="block text-gray-700 font-bold mb-2">
                            Price Per Hour
                        </label>
                        <input
                            type="number"
                            id="price_per_hour"
                            name="price_per_hour"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Enter price per hour"
                            defaultValue={room.price_per_hour}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Enter full address"
                            defaultValue={room.address}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Location (Building, Floor, Room)"
                            defaultValue={room.location}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="availability" className="block text-gray-700 font-bold mb-2">
                            Availability
                        </label>
                        <input
                            type="text"
                            id="availability"
                            name="availability"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Availability (Monday - Friday, 9am - 5pm)"
                            defaultValue={room.availability}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="amenities" className="block text-gray-700 font-bold mb-2">
                            Amenities
                        </label>
                        <input
                            type="text"
                            id="amenities"
                            name="amenities"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Amenities CSV (projector, whiteboard, etc.)"
                            defaultValue={room.amenities}
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
                            Image
                        </label>

                        <Image
                            src={imageSrc}
                            alt={room.name}
                            className="w-full sm:w-1/3 h-64 object-cover rounded-lg"
                            width={400}
                            height={100}
                        />

                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            className="border rounded w-full py-2 px-3"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setPreviewImage(URL.createObjectURL(file));
                                }
                            }}
                        />

                        <input
                            type="hidden"
                            name="existingImage"
                            value={room.image}
                        />

                        <input
                            type="hidden"
                            name="roomId"
                            value={room.$id}
                        />

                    </div>

                    <div className="flex flex-col gap-5">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditRoomForm