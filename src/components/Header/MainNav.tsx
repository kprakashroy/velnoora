'use client';

import Link from 'next/link';
import React from 'react';
import { LuUser2 } from 'react-icons/lu';
import { RiSearch2Line } from 'react-icons/ri';

import { NavLinks } from '@/data/content';
import { useAuthApi } from '@/hooks/useAuthApi';
import Logo from '@/shared/Logo/Logo';

import CartSideBar from '../CartSideBar';
import NavigationItem from '../NavItem';
import MenuBar from './MenuBar';

const MainNav = () => {
  const { user, userProfile } = useAuthApi();

  return (
    <div className="container flex items-center justify-between">
      <div className="flex-1">
        <Logo />
      </div>

      <div className="hidden items-center gap-7 lg:flex">
        {/* Show Home link only for logged-in admin users */}
        {user && userProfile?.admin && (
          <NavigationItem
            key="home"
            menuItem={{
              id: 'home',
              name: 'Home',
              href: '/',
            }}
          />
        )}
        {NavLinks.map((item) => (
          <NavigationItem key={item.id} menuItem={item} />
        ))}
        {user && userProfile?.admin && (
          <Link
            href="/add-collection"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Add Collection
          </Link>
        )}
      </div>

      <div className="hidden flex-1 items-center justify-end gap-7 lg:flex">
        <RiSearch2Line className="text-2xl" />

        {user ? (
          <Link href="/profile" className="flex items-center gap-2">
            <LuUser2 className="text-2xl" />
            <span className="text-sm font-medium">
              {userProfile?.name || 'Profile'}
            </span>
          </Link>
        ) : (
          <Link href="/login">
            <LuUser2 className="text-2xl" />
          </Link>
        )}

        {/* CartSideBar - Show only for logged-in admin users */}
        {user && userProfile?.admin && <CartSideBar />}
      </div>

      <div className="lg:hidden">
        <MenuBar />
      </div>
    </div>
  );
};

export default MainNav;
