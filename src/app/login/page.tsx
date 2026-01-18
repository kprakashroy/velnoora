'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// import { FaGoogle } from 'react-icons/fa6';
import { useAuthApi } from '@/hooks/useAuthApi';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
// import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';

const PageLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { /* signInWithGoogle, */ signInWithEmail, error: authError } =
    useAuthApi();
  const router = useRouter();

  // const handleGoogleSignIn = async () => {
  //   try {
  //     setLoading(true);
  //     setError('');
  //     await signInWithGoogle();
  //     setSuccess('Redirecting to Google...');
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to sign in with Google');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signInWithEmail(email, password);
      setSuccess('Sign in successful! Redirecting...');
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nc-PageLogin" data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
          Login
        </h2>
        <div className="mx-auto max-w-md">
          <div className="space-y-6">
            {/* Error Message */}
            {(error || authError) && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                {error || authError}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                {success}
              </div>
            )}

            {/* Google Sign In */}
            {/* <div className="">
              <ButtonSecondary 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex w-full items-center gap-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
              >
                <FaGoogle className="text-2xl" /> 
                {loading ? 'Signing in...' : 'Continue with Google'}
              </ButtonSecondary>
            </div>

            <div className="relative text-center">
              <span className="relative z-10 inline-block rounded-full bg-gray px-4 text-sm font-medium ">
                OR
              </span>
              <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border border-neutral-300" />
            </div> */}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignIn} className="grid gap-6">
              <FormItem label="Email address">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  placeholder="example@example.com"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  required
                />
              </FormItem>
              <FormItem label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  required
                />
              </FormItem>
              <ButtonPrimary type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Continue'}
              </ButtonPrimary>
            </form>

            <div className="flex flex-col items-center justify-center gap-2">
              <Link
                href="/forgot-pass"
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot password
              </Link>
              <span className="block text-center text-sm text-neutral-500">
                Don&apos;t have an account? {` `}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary/80"
                >
                  Signup
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
