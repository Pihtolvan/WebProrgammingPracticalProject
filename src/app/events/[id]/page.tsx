import { prisma } from '../../../lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DeleteButton from '@/components/DeleteButton';
import { deleteEvent } from '../../../actions/events';


// same one as one iside edit folder, but as we have to have "Details" page this one just spreads functions     
export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 flex flex-col items-center">

      <div className="max-w-3xl w-full bg-white p-8 md:p-12 border border-purple-100/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-4 md:mt-10">
        <Link 
          href="/events" 
          className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 hover:-translate-x-1 transition-all duration-200 mb-8">
          ← Back to Events
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-xl bg-purple-50 text-purple-700 font-semibold border border-purple-100">
            📅 {new Date(event.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-200">
            📍 {event.location}
          </span>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">About this event</h3>
          <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">{event.description || 'No description provided for this event.'}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-100">
          <Link 
            href={`/events/${event.id}/edit`} 
            className="flex-1 text-center bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-6 py-3.5 rounded-xl font-medium transition-all duration-200">
            Edit Event
          </Link>
          <div className="flex-1 flex">
            <DeleteButton eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
}