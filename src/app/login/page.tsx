'use client';

import { loginUser } from '../../actions/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setError('');
    const result = await loginUser(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      router.push('/');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 p-4">
      <div className="w-full max-w-md p-10 bg-white border border-purple-100/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-900 tracking-tight">Welcome Back</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
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
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              placeholder="********"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white p-3 rounded-xl font-medium shadow-sm shadow-purple-200 hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-200 mt-2">
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-purple-600 font-medium hover:text-purple-700 hover:underline transition-all">
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
}