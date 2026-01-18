import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { MdOutlineFilterVintage } from 'react-icons/md';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link
      className="flex cursor-pointer items-center gap-2 text-primary"
      href="/"
    >
      <MdOutlineFilterVintage className="text-4xl" />
      <span className={`${className} text-2xl font-bold`}>Velnoora</span>
    </Link>
  );
};

export default Logo;
