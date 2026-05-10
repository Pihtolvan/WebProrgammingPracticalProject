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

  const formattedDate = event.date.toISOString().slice(0, 16);
  const updateEventWithId = updateEvent.bind(null, event.id);

  return (
    <div className="min-h-screen bg-gray-100 text-black p-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          <Link href="/events" className="text-blue-600 hover:underline">Cancel</Link>
        </div>

        <form action={updateEventWithId} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" defaultValue={event.title} required className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="datetime-local" name="date" defaultValue={formattedDate} required className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" defaultValue={event.location} required className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" defaultValue={event.description || ''} rows={4} className="w-full mt-1 p-2 border rounded"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}