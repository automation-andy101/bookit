'use server';

import { createSessionClient } from '/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { DateTime } from "luxon";

// Convert a date string to a Luxon DateTime object in UTC
function toUTCDateTime(dateString) {
    return DateTime.fromISO(dateString, { zone: 'utc'}).toUTC();
}

// Check for overlapping date/time ranges (checkinA and CheckOutA are the dates entered by the user into the form)
function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
    return checkInA < checkOutB && checkOutA > checkInB;
}

async function checkRoomAvailability(roomId, checkIn, checkOut) {
    noStore();

    const sessionCookies = cookies().get("appwrite-session");

    if (!sessionCookies) {
        redirect("/login");
    }

    try {
        const { databases } = await createSessionClient(
            sessionCookies.value
        );

        const checkInDateTimeToValidate = toUTCDateTime(checkIn);
        const checkOutDateTimeToValidate = toUTCDateTime(checkOut);
        
        // Fetch all bookings for a given room
        const { documents: bookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            [
                Query.equal("room_id", roomId),
                Query.limit(100),
                Query.offset(0),
            ]
        );

        // Loop over bookings and check for overlapse
        for (const booking of bookings) {
            const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
            const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);

            if (dateRangesOverlap(checkInDateTimeToValidate, checkOutDateTimeToValidate, bookingCheckInDateTime, bookingCheckOutDateTime)) {
                return false; // Overlap found DO NOT BOOK
            }
        }

        // No overlap found, continue with booking
        return true;

    } catch (error) {
        console.log("Failed to get to check availability", error);
        
        return {
            error: "Failed to get to check availability"
        }
    }
}

export default checkRoomAvailability;
