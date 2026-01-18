import { redirect } from 'next/navigation';
import React from 'react';

import { createClient as createServerSupabase } from '@/lib/supabase-server';

import SectionCategories from './SectionCategories';
import SectionHeader from './SectionHeader';
import SectionMidBanner from './SectionMidBanner';
import SectionProducts from './SectionProducts';
import SectionSlider from './SectionSlider';
import SectionStyle from './SectionStyle';

const page = async () => {
  // Protect this route - only allow logged-in admin users
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let isAdmin = false;
  
  // Only check admin status if user is logged in
  if (session?.user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('admin')
      .eq('id', session.user.id)
      .single();

    isAdmin = profile?.admin || false;
  }

  // Redirect to /products if:
  // 1. User is NOT logged in (no session)
  // 2. User IS logged in but NOT admin
  if (!isAdmin) {
    redirect('/products');
  }

  // Only logged-in admin users reach here - show home page
  return (
    <div>
      <div className="my-7">
        <SectionHeader />
      </div>

      <div className="pt-10">
        <SectionSlider />
      </div>

      <div className="py-24">
        <SectionProducts />
      </div>

      <div className="pb-24">
        <SectionCategories />
      </div>

      <div className="pb-24">
        <SectionMidBanner />
      </div>

      <div className="pb-24">
        <SectionStyle />
      </div>
    </div>
  );
};

export default page;
