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
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Events</h1>
          <Link href="/" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 hover:-translate-x-1 transition-all duration-200 mb-8">
            ← Back Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Create event collum*/}
          <div className="lg:col-span-1 bg-white p-8 border border-purple-100/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
            <h2 className="text-xl font-bold mb-6 text-slate-900 tracking-tight">Create New Event</h2>

            <form action={createEvent} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" name="title" required 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl 
                focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none" 
                placeholder="My Event" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="datetime-local" name="date" required 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl 
                focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" name="location" required 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl 
                focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none" 
                placeholder="Main St. 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" rows={3} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl 
                focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none" 
                placeholder="What is this event about?"></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-purple-600 text-white p-3 rounded-xl font-medium shadow-sm shadow-purple-200 
                hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-200 mt-2">
                Save Event
              </button>
            </form>
          </div>

          {/* Events list */}
          <div className="lg:col-span-2 space-y-5">
            {events.length === 0 ? (
              <div className="bg-white p-10 border border-purple-100/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No events scheduled</h3>
                <p className="text-slate-500">You don't have any events yet. Create one on the left to get started!</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="bg-white p-6 md:p-8 border border-purple-100/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(147,51,234,0.08)] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                          📅 {new Date(event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        <span className="text-slate-600 flex items-center gap-1">
                          📍 {event.location}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="text-slate-600 mt-3 leading-relaxed">{event.description}</p>
                      )}
                    </div>
                    
                    <div className="shrink-0 mt-2 sm:mt-0">
                      <Link 
                        href={`/events/${event.id}`} 
                        className="inline-flex items-center justify-center w-full sm:w-auto bg-slate-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 border border-purple-100 px-5 py-2.5 rounded-xl font-medium transition-all duration-200">
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