'use server';

import { createAdminClient } from '/config/appwrite';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';
import { unstable_noStore as noStore } from 'next/cache';

async function getAllRooms() {
  noStore();
  
  try {
    const { databases } = await createAdminClient();

    // Fetch rooms
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      [
        Query.limit(100),
        Query.offset(0),
      ]
    );

    // Revalidate the cache for this path
    revalidatePath('/', 'layout');

    return rooms;
  } catch (error) {
    console.log('Failed to get rooms', error);
    redirect('/error');
  }
}

export default getAllRooms;
