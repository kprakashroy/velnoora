import { redirect } from 'next/navigation';
// import React from 'react';

// import { createClient as createServerSupabase } from '@/lib/supabase-server';

// Home page sections - Hidden, redirected to collections by default
// import SectionCategories from './home/SectionCategories';
// import SectionHeader from './home/SectionHeader';
// import SectionMidBanner from './home/SectionMidBanner';
// import SectionProducts from './home/SectionProducts';
// import SectionSlider from './home/SectionSlider';
// import SectionStyle from './home/SectionStyle';

const page = () => {
  // Default behavior: Always redirect root URL to products page
  redirect('/products');

  // Previous logic with admin check - Commented for future use
  // const page = async () => {
  //   // Check if user is logged in and admin server-side
  //   // const supabase = createServerSupabase();
  //   
  //   // try {
  //   //   const {
  //   //     data: { session },
  //   //     error: sessionError,
  //   //   } = await supabase.auth.getSession();

  //   //   // If user is NOT logged in, redirect to /products immediately
  //   //   if (sessionError || !session?.user) {
  //   //     redirect('/products');
  //   //   }

  //   //   // User is logged in - check if admin
  //   //   const { data: profile, error: profileError } = await supabase
  //   //     .from('user_profiles')
  //   //     .select('admin')
  //   //     .eq('id', session.user.id)
  //   //     .single();

  //   //   // If profile doesn't exist or user is not admin, redirect to /products
  //   //   if (profileError || !profile?.admin) {
  //   //     redirect('/products');
  //   //   }

  //   //   // Only logged-in admin users reach here - show home page content
  //   //   return (
  //   //   <div>
  //   //     <div className="my-7">
  //   //       <SectionHeader />
  //   //     </div>

  //   //     <div className="pt-10">
  //   //       <SectionSlider />
  //   //     </div>

  //   //     <div className="py-24">
  //   //       <SectionProducts />
  //   //     </div>

  //   //     <div className="pb-24">
  //   //       <SectionCategories />
  //   //     </div>

  //   //     <div className="pb-24">
  //   //       <SectionMidBanner />
  //   //     </div>

  //   //     <div className="pb-24">
  //   //       <SectionStyle />
  //   //     </div>
  //   //   </div>
  //   //   );
  //   // } catch (error) {
  //   //   // On any error, redirect to /products
  //   //   redirect('/products');
  //   // }
  // };
};

export default page;
