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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border border-purple-100/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Event Manager
        </h1>
        <p className="text-slate-500 mb-10 text-lg">
          The minimal, modern way to track and manage your upcoming events.
        </p>

        {user ? (
          /* Loggedin */
          <div className="space-y-8">
            <div className="inline-block px-6 py-3 bg-purple-50 border border-purple-100 rounded-2xl text-purple-800 font-medium tracking-wide">
              Welcome back, <strong className="text-purple-950">{(user.name as string) || (user.email as string)}</strong>!
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/events" 
                className="bg-purple-600 text-white px-8 py-3 rounded-xl font-medium shadow-sm shadow-purple-200 hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-200">
                Go to My Events
              </Link>
              

              <form action={logoutUser}>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-white text-slate-600 px-8 py-3 rounded-xl font-medium border border-slate-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200">
                  Log Out
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* not loggedin */
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            <Link 
              href="/login" 
              className="bg-purple-600 text-white px-8 py-3 rounded-xl font-medium shadow-sm shadow-purple-200 hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-200">
              Sign In
            </Link>

            <Link 
              href="/register" 
              className="bg-purple-50 text-purple-700 px-8 py-3 rounded-xl font-medium border border-purple-200 hover:bg-purple-100 transition-all duration-200">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
