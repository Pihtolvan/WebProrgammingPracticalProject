import { registerUser } from '../../actions/auth';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 p-4">
      <div className="w-full max-w-md p-10 bg-white border border-purple-100/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-900 tracking-tight">Create an Account</h1>
        
        <form action={registerUser} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              placeholder="Your Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              minLength={6}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              placeholder="At least 6 characters"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white p-3 rounded-xl font-medium shadow-sm shadow-purple-200 hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-200 mt-2">
            Register
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-600 font-medium hover:text-purple-700 hover:underline transition-all">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}