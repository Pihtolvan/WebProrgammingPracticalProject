'use client';

import { deleteEvent } from '../actions/events';

export default function DeleteButton({ eventId }: { eventId: string }) {
  return (
    <form action={deleteEvent.bind(null, eventId)} className="w-full">
      <button 
        type="submit" 
        onClick={(e) => {
          if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            e.preventDefault();
          }
        }}
        className="w-full bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 px-6 py-3.5 rounded-xl font-medium transition-all duration-200">
        Delete Event
      </button>
    </form>
  );
}