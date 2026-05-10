import Link from 'next/link';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { logoutUser } from '../actions/auth';

// Cookie check and token verification
export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  let user = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      user = payload;
    } catch (error) {
      console.log('Invalid or expired token, ignoring...');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Event Manager
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          The minimal, modern way to track and manage your upcoming events.
        </p>

        {user ? (
          /* Loggedin */
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Welcome back, <strong>{(user.name as string) || (user.email as string)}</strong>!
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/events" 
                className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
              >
                Go to My Events
              </Link>
              

              <form action={logoutUser}>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-red-100 text-red-700 px-6 py-2 rounded shadow hover:bg-red-200 transition"
                >
                  Log Out
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* not loggedin */
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded shadow hover:bg-gray-300 transition"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
