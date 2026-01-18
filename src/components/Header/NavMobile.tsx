import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import React from 'react';
import { MdClose, MdKeyboardArrowDown } from 'react-icons/md';

import { NavLinks } from '@/data/content';
import { useAuthApi } from '@/hooks/useAuthApi';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Logo from '@/shared/Logo/Logo';

import type { NavItemType } from '../NavItem';

export interface NavMobileProps {
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({ onClickClose }) => {
  const { userProfile } = useAuthApi();
  
  /* eslint-disable */
  const renderMenuChild = (
    item: NavItemType,
    itemClass = ' pl-3 font-medium ',
  ) => {
    return (
      <ul className="nav-mobile-sub-menu pb-1 pl-6 text-base">
        {item.children?.map((i) => (
          <Disclosure key={i.id} as="li">
            <Link
              href={{
                pathname: i.href || undefined,
              }}
              className={`mt-0.5 flex rounded-lg pr-4 text-sm hover:bg-neutral-100 ${itemClass}`}
            >
              <span
                className={`py-1 ${!i.children ? 'block w-full' : ''}`}
                onClick={onClickClose}
              >
                {i.name}
              </span>
              {i.children && (
                <span
                  className="flex grow items-center"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="flex grow justify-end"
                  >
                    <MdKeyboardArrowDown className="text-xl" />
                  </Disclosure.Button>
                </span>
              )}
            </Link>
            {i.children && (
              <Disclosure.Panel>
                {renderMenuChild(i, 'pl-3')}
              </Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const renderItem = (item: NavItemType, index: number) => {
    return (
      <Disclosure key={index} as="li">
        <Link
          className="flex w-full items-center rounded-lg px-4 text-sm font-medium uppercase tracking-wide hover:bg-slate-100"
          href={{
            pathname: item.href || undefined,
          }}
        >
          <span
            className={!item.children ? 'block w-full' : ''}
            onClick={onClickClose}
          >
            {item.name}
          </span>
          {item.children && (
            <span className="block grow" onClick={(e) => e.preventDefault()}>
              <Disclosure.Button as="span" className="flex grow justify-end">
                <MdKeyboardArrowDown className="text-xl text-black" />
              </Disclosure.Button>
            </span>
          )}
        </Link>
        {item.children && (
          <Disclosure.Panel>{renderMenuChild(item)}</Disclosure.Panel>
        )}
      </Disclosure>
    );
  };
  /* eslint-disable */

  return (
    <div className="h-screen w-full divide-y divide-neutral-300 overflow-y-auto bg-white py-2 shadow-lg ring-1 transition">
      <div className="px-5 py-2">
        <Logo />
        <div className="absolute right-2 top-2 p-1">
          <MdClose onClick={onClickClose} />
        </div>
      </div>
      <ul className="flex flex-col space-y-5 px-5 py-6">
        {NavLinks.map(renderItem)}
        {userProfile?.admin && (
          <li>
            <Link
              href="/add-collection"
              className="flex w-full items-center rounded-lg px-4 text-sm font-medium uppercase tracking-wide hover:bg-slate-100"
              onClick={onClickClose}
            >
              <span className="block w-full">Add Collection</span>
            </Link>
          </li>
        )}
      </ul>
      <div className="mt-3 px-5 py-3">
        <div className="flex flex-row items-center gap-5">
          <ButtonPrimary
             href="https://www.themealchemy.com/products/luxloom"
            sizeClass="px-7 py-4"
          >
            Buy Template
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default NavMobile;
