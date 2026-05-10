'use server';

import { prisma } from '../lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { revalidatePath } from 'next/cache';

// securely gets user id
async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) throw new Error('Not authenticated');
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload.userId as string;
}

// creates/saves event + reload page
export async function createEvent(formData: FormData) {
  const userId = await getUserId();
  
  const title = formData.get('title') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const description = formData.get('description') as string;

  await prisma.event.create({
    data: {
      title,
      date: new Date(date), 
      location,
      description,
      userId,
    },
  });
  revalidatePath('/events');
}