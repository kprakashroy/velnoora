import type { FC } from 'react';
import React from 'react';

interface AccordionProps {
  question: string;
  answer: string;
}

const Accordion: FC<AccordionProps> = ({ question, answer }) => {
  return (
    <div className="">
      <details className="w-full rounded-lg bg-gray">
        <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 rounded-lg p-3">
          {question}
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="block size-5 group-open:hidden"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="hidden size-5 group-open:block"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
          </div>
        </summary>
        <div className="px-6 pb-4 text-sm text-neutral-500">{answer}</div>
      </details>
    </div>
  );
};

export default Accordion;
