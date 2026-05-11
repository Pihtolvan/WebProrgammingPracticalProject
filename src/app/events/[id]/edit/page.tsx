import { prisma } from '../../../../lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { updateEvent } from '../../../../actions/events';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  // user identification + await id
  const resolvedParams = await params;
  const eventId = resolvedParams.id;
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) redirect('/login');

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  const userId = payload.userId as string;

  // get id + check id existance
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.userId !== userId) {
    redirect('/events');
  }

  // Local time adapt
  const offset = event.date.getTimezoneOffset() * 60000;
  const localDate = new Date(event.date.getTime() - offset);
  const formattedDate = localDate.toISOString().slice(0, 16);

  
  const updateEventWithId = updateEvent.bind(null, event.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 flex justify-center pt-10 md:pt-20">

      <div className="max-w-2xl w-full bg-white p-8 md:p-10 border border-purple-100/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Event</h1>
          <Link href="/events" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 hover:-translate-x-1 transition-all duration-200 mb-8">
            Cancel & Return
          </Link>
        </div>

        <form action={updateEventWithId} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" name="title" defaultValue={event.title} 
            required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl 
            focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input type="datetime-local" name="date" defaultValue={formattedDate} 
            required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl 
            focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input type="text" name="location" defaultValue={event.location} 
            required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl 
            focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" defaultValue={event.description || ''} 
            rows={4} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl 
            focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none">
            </textarea>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white p-3 rounded-xl font-medium shadow-sm shadow-purple-200 hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-200 mt-4">
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}