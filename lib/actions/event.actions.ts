'use server';

import Event, { IEvent } from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { revalidatePath } from 'next/cache';

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean()
    } catch {
        return [];
    }
}

export const addEvent = async (values: any) => {
    try {
        await connectDB();
        
        // Create the event directly in the database
        const newEvent = await Event.create(values);
        
        // Revalidate the events page to show the new event
        revalidatePath('/events');
        
        return { 
            success: true, 
            data: JSON.parse(JSON.stringify(newEvent)) 
        };
    } catch (error) {
        console.error('Error creating event:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to create event' 
        };
    }
}

export const deleteEventById = async (eventId: string) => {
    try {
        await connectDB();
        await Event.findByIdAndDelete(eventId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting event:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to delete event' };
    }
}

export const updateEventById = async (eventId: string, values: any) => {
    try {
        await connectDB();
        const updatedEvent = await Event.updateOne({ _id: eventId }, values);
        return { 
            success: true, 
            data: JSON.parse(JSON.stringify(updatedEvent)) 
        };
    } catch (error) {
        console.error('Error updating event:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update event' };
    }
}