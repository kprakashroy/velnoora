'use client';

import { Popover, Transition } from '@headlessui/react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import React, { Fragment, useEffect, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';

// <--- NavItemType --->
export interface MegaMenuItem {
  id: string;
  image: string;
  title: string;
  items: NavItemType[];
}
export interface NavItemType {
  id: string;
  name: string;
  isNew?: boolean;
  href: Route;
  targetBlank?: boolean;
  children?: NavItemType[];
  megaMenu?: MegaMenuItem[];
  type?: 'dropdown' | 'none';
}

export interface NavigationItemProps {
  menuItem: NavItemType;
}

type NavigationItemWithRouterProps = NavigationItemProps;

const NavigationItem: FC<NavigationItemWithRouterProps> = ({ menuItem }) => {
  const [menuCurrentHovers, setMenuCurrentHovers] = useState<string[]>([]);

  // CLOSE ALL MENU OPENING WHEN CHANGE HISTORY
  const locationPathName = usePathname();
  useEffect(() => {
    setMenuCurrentHovers([]);
  }, [locationPathName]);

  const onMouseEnterMenu = (id: string) => {
    setMenuCurrentHovers((state) => [...state, id]);
  };

  const onMouseLeaveMenu = (id: string) => {
    setMenuCurrentHovers((state) => {
      return state.filter((item, index) => {
        return item !== id && index < state.indexOf(id);
      });
    });
  };

  // ===================== MENU MAIN MENU =====================
  const renderMainItem = (item: NavItemType) => {
    // Force full page reload for Collections and product category links
    const isProductCategoryLink = item.href === '/products' || item.name === 'Collections';
    
    if (isProductCategoryLink) {
      return (
        <a
          rel="noopener noreferrer"
          className="inline-flex items-center font-medium hover:text-secondary cursor-pointer"
          href={item.href || '/'}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = item.href || '/';
          }}
        >
          {item.name}
          {item.type && (
            <BsChevronDown className="-mr-1 ml-1 size-4" aria-hidden="true" />
          )}
        </a>
      );
    }
    
    return (
      <Link
        rel="noopener noreferrer"
        className="inline-flex items-center font-medium hover:text-secondary "
        href={item.href || '/'}
      >
        {item.name}
        {item.type && (
          <BsChevronDown className="-mr-1 ml-1 size-4" aria-hidden="true" />
        )}
      </Link>
    );
  };

  const renderDropdownMenuNavlink = (item: NavItemType) => {
    // Force full page reload for Collections and product category links
    const isProductCategoryLink = item.href === '/products' || item.name === 'Collections';
    
    if (isProductCategoryLink) {
      return (
        <a
          target={item.targetBlank ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="hover flex items-center rounded-md px-4 py-2 font-normal hover:bg-secondary/10 cursor-pointer"
          href={item.href || ''}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = item.href || '/';
          }}
        >
          {item.name}
          {item.type && (
            <BsChevronDown className="-mr-1 ml-1 size-4" aria-hidden="true" />
          )}
        </a>
      );
    }
    
    return (
      <Link
        target={item.targetBlank ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="hover flex items-center rounded-md px-4 py-2 font-normal hover:bg-secondary/10"
        href={item.href || ''}
      >
        {item.name}
        {item.type && (
          <BsChevronDown className="-mr-1 ml-1 size-4" aria-hidden="true" />
        )}
      </Link>
    );
  };

  const renderDropdownMenuNavlinkHasChild = (item: NavItemType) => {
    const isHover = menuCurrentHovers.includes(item.id);
    return (
      <Popover
        as="li"
        key={item.id}
        className="menu-item menu-dropdown relative flex items-center px-2"
        onMouseEnter={() => onMouseEnterMenu(item.id)}
        onMouseLeave={() => onMouseLeaveMenu(item.id)}
      >
        {() => (
          <>
            <div>{renderDropdownMenuNavlink(item)}</div>
            <Transition
              as={Fragment}
              show={isHover}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                static
                className="sub-menu absolute left-full top-0 z-10 w-56 pl-2"
              >
                <ul className="relative grid space-y-1 rounded-lg bg-white py-4 shadow-lg ring-1 ring-black ring-opacity-5">
                  {item.children?.map((i) => {
                    if (i.type) {
                      return renderDropdownMenuNavlinkHasChild(i);
                    }
                    return (
                      <li key={i.id} className="px-2">
                        {renderDropdownMenuNavlink(i)}
                      </li>
                    );
                  })}
                </ul>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  // ===================== MENU DROPDOW =====================
  const renderDropdownMenu = (menuDropdown: NavItemType) => {
    const isHover = menuCurrentHovers.includes(menuDropdown.id);
    return (
      <Popover
        as="li"
        className={`menu-item menu-dropdown relative flex items-center ${
          menuDropdown.isNew ? 'menuIsNew_lv1' : ''
        }`}
        onMouseEnter={() => onMouseEnterMenu(menuDropdown.id)}
        onMouseLeave={() => onMouseLeaveMenu(menuDropdown.id)}
      >
        {() => (
          <>
            <div>{renderMainItem(menuDropdown)}</div>
            <Transition
              as={Fragment}
              show={isHover}
              enter="transition ease-out duration-150 "
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                static
                className="sub-menu absolute left-0 top-full z-10 w-56 will-change-transform"
              >
                <ul className="relative grid space-y-1 rounded-lg bg-white py-4 shadow-lg ring-1 ring-black ring-opacity-5">
                  {menuDropdown.children?.map((i) => {
                    if (i.type) {
                      return renderDropdownMenuNavlinkHasChild(i);
                    }
                    return (
                      <li
                        key={i.id}
                        className={`px-2 ${i.isNew ? 'menuIsNew' : ''}`}
                      >
                        {renderDropdownMenuNavlink(i)}
                      </li>
                    );
                  })}
                </ul>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  switch (menuItem.type) {
    case 'dropdown':
      return renderDropdownMenu(menuItem);
    default:
      return (
        <li className="menu-item flex items-center">
          {renderMainItem(menuItem)}
        </li>
      );
  }
};

export default NavigationItem;
