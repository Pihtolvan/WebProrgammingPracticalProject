import { prisma } from '../../../lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
    <div className="min-h-screen bg-gray-100 text-black p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
        <Link href="/events" className="text-blue-600 hover:underline mb-6 inline-block">← Back to List</Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
        <div className="text-gray-600 mb-6 flex flex-col gap-1">
          <span className="font-semibold text-blue-600">📅 {new Date(event.date).toLocaleString()}</span>
          <span>📍 {event.location}</span>
        </div>

        <div className="prose max-w-none mb-8 text-gray-800 border-t pt-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p>{event.description || 'No description provided.'}</p>
        </div>
        <div className="flex gap-4 border-t pt-6">
          <Link 
            href={`/events/${event.id}/edit`} 
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Edit Event
          </Link>

          <form action={deleteEvent.bind(null, event.id)}>
            <button 
              type="submit" 
              className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition"
            >
              Delete Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}