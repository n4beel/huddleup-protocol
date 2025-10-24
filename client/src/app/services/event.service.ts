import axios from "axios";
import { BASE_URL } from "../config";
import { Event } from "../types";

export const getLatestEvents = async (): Promise<Event[]> => {
    try {
        const response = await axios.get<Event[]>(`${BASE_URL}/events?status=funded&isActive=true`);
        const events = response.data;

        // Return only first 3 if there are more than 3, otherwise return all
        return events.length > 3 ? events.slice(0, 3) : events;
    } catch (error) {
        console.error("Error fetching latest events:", error);
        return [];
    }
};


export const getPastEvents = async (): Promise<Event[]> => {
    try {
        const response = await axios.get<Event[]>(`${BASE_URL}/events?status=funded&isActive=false`);
        const events = response.data;

        // Return only first 3 if there are more than 3, otherwise return all
        return events.length > 3 ? events.slice(0, 3) : events;
    } catch (error) {
        console.error("Error fetching latest events:", error);
        return [];
    }
};



export const getEventDetail = async (id: string): Promise<Event | null> => {
    try {
        const response = await axios.get<Event>(`${BASE_URL}/events/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event details:", error);
        return null; // ✅ ensures function always returns a value
    }
};

export const createEvent = async (data: {
    title: string;
    description: string;
    eventDate: string;
    location: string;
    eventType: string;
    fundingRequired: number;
    airdropAmount: number;
    bannerImage: string;
}) => {
    try {
        const response = await axios.post(`${BASE_URL}/events`, data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error creating event:", error);
        throw new Error(error?.response?.data?.message || "Failed to create event");
    }
};


export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();

    // ⚠️ Change "image" to match your backend field name
    // If your backend expects "file", keep it as is.
    formData.append("image", file);

    const response = await axios.post(`${BASE_URL}/upload/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Assuming your backend returns { url: "https://..." }
    return response.data.url;
  } catch (error: any) {
    console.error("Image upload failed:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to upload image");
  }
};
