import type { FC } from 'react';
import React from 'react';

import MainNav from './MainNav';

export interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="nc-Header sticky inset-x-0 top-0 z-50 bg-white py-5">
      <MainNav />
    </div>
  );
};

export default Header;
