'use client';

import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import Radio from '@/shared/Radio/Radio';

const sortOrderRadios = [
  { name: 'In stock', id: 'In-stock' },
  { name: 'Out of stock', id: 'out-of-stock' },
  { name: 'Featured', id: 'featured' },
  { name: 'Best Seller', id: 'best-seller' },
  { name: 'Alphabetically, A-Z', id: 'alphabetically-a-z' },
  { name: 'Alphabetically, Z-A', id: 'alphabetically-z-a' },
];

const SortBy = () => {
  return (
    <div className="font-medium">
      <Menu as="div" className="relative inline-block">
        <Menu.Button className="flex items-center gap-1">
          <span>Sort by</span>
          <span className="flex size-4 items-center justify-center">
            <MdKeyboardArrowDown className="text-sm" />
          </span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="divide-gray-100 absolute left-0 z-50 mt-2 w-52 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="grid gap-4 p-5">
              {sortOrderRadios.map((item) => (
                <Radio
                  id={item.id}
                  key={item.id}
                  name="radioNameSort"
                  label={item.name}
                  sizeClassName="w-5 h-5"
                  className="!text-sm"
                />
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default SortBy;
