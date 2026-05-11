import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { createEvent } from '../../actions/events';
import Link from 'next/link';
import { deleteEvent } from '../../actions/events';

// fetch user event by id
async function getUserEvents() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return [];

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  
  const events = await prisma.event.findMany({
    where: { userId: payload.userId as string },
    orderBy: { date: 'asc' }, 
  });
  
  return events;
}

export default async function EventsPage() {
  const events = await getUserEvents();

  return (
    <div className="min-h-screen bg-gray-100 text-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <Link href="/" className="text-blue-600 hover:underline">← Back Home</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Create event collum*/}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <form action={createEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" required className="w-full mt-1 p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="datetime-local" name="date" required className="w-full mt-1 p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="location" required className="w-full mt-1 p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" rows={3} className="w-full mt-1 p-2 border rounded"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Save Event
              </button>
            </form>
          </div>

          {/* Events list */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            {events.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                You don't have any events yet. Create one to get started!
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-blue-600 font-semibold mt-1">
                        {new Date(event.date).toLocaleString()}
                      </p>
                      <p className="text-gray-600 mt-2 text-sm">📍 {event.location}</p>
                      {event.description && (
                        <p className="text-gray-700 mt-3">{event.description}</p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Link 
                        href={`/events/${event.id}`} 
                        className="text-blue-600 hover:underline font-medium">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}