'use client';

import Link from 'next/link';
import React, { useState } from 'react';

// import { FaGoogle } from 'react-icons/fa6';
import { useAuthApi } from '@/hooks/useAuthApi';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
// import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';

const PageSignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { /* signInWithGoogle, */ signUpWithEmail } = useAuthApi();

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

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signUpWithEmail(email, password, name);
      setSuccess(
        'Account created successfully! Please check your email to verify your account.',
      );
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`nc-PageSignUp `} data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
          Signup
        </h2>
        <div className="mx-auto max-w-md ">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
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
                {loading ? 'Signing up...' : 'Continue with Google'}
              </ButtonSecondary>
            </div>

            <div className="relative text-center">
              <span className="relative z-10 inline-block rounded-full bg-gray px-4 text-sm font-medium ">
                OR
              </span>
              <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border border-neutral-300" />
            </div> */}

            {/* Email/Password Form */}
            <form
              onSubmit={handleEmailSignUp}
              className="grid grid-cols-1 gap-6"
            >
              <FormItem label="Full Name">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  placeholder="John Doe"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  required
                />
              </FormItem>
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
              <FormItem label="Confirm Password">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  required
                />
              </FormItem>
              <ButtonPrimary type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Continue'}
              </ButtonPrimary>
            </form>

            <span className="block text-center text-sm text-neutral-500">
              Already have an account? {` `}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80"
              >
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
