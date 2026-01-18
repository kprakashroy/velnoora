import '@splidejs/splide/css/core';

import type { Options } from '@splidejs/react-splide';
import { Splide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import type { FC, ReactNode } from 'react';
import React from 'react';

interface AutoScrollSliderProps {
  children: ReactNode;
  trigger?: boolean;
  options?: Options;
}

const AutoScrollSlider: FC<AutoScrollSliderProps> = ({
  children,
  trigger,
  options,
}) => {
  return (
    <div>
      <Splide options={options} extensions={trigger ? { AutoScroll } : {}}>
        {children}
      </Splide>
    </div>
  );
};

export default AutoScrollSlider;
