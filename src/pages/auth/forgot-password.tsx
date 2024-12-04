import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Logo from '@/components/common/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo className="w-12 h-12 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-text-primary">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            We've sent password reset instructions to your email address.
          </p>
          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:text-primary-hover"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo className="w-12 h-12 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-text-primary">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-darker py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-surface-dark rounded-md shadow-sm placeholder-text-secondary bg-surface-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send reset instructions'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="font-medium text-primary hover:text-primary-hover"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 