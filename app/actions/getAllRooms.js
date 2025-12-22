'use server';

import { createAdminClient } from '/config/appwrite';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getAllRooms() {
  try {
    const { databases } = await createAdminClient();
    console.log("Andy 1 -" + process.env.NEXT_PUBLIC_APPWRITE_DATABASE)
    console.log("Andy 2 -" + process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS)
    console.log("Andy 3 -" + databases)

    // Fetch rooms
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS
    );

    // Revalidate the cache for this path
    revalidatePath('/', 'layout');

    return rooms;
  } catch (error) {
    console.log('Failed to get rooms', error);
    // redirect('/error');
  }
}

export default getAllRooms;
