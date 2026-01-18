import type { FC } from 'react';
import React from 'react';
import { PiShareBold } from 'react-icons/pi';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Input from '@/shared/Input/Input';
import Textarea from '@/shared/TextArea/TextArea';

interface CommentFormProps {
  tag: string;
}

const CommentForm: FC<CommentFormProps> = ({ tag }) => {
  return (
    <div className="space-y-5">
      <span className="text-sm">Tags: {tag}</span>
      <p className="flex items-center gap-1 font-medium">
        <PiShareBold className="text-lg" /> Share
      </p>
      <span>0 comments</span>

      <div>
        <h3 className="mb-3 text-2xl font-medium">Leave a comment</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-5">
            <Input
              placeholder="Full name"
              sizeClass="h-14 px-4 py-5"
              type="text"
              rounded="rounded-lg"
              className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
            />
            <Input
              placeholder="Email"
              sizeClass="h-14 px-4 py-5"
              type="email"
              rounded="rounded-lg"
              className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
            />
          </div>
          <div>
            <Textarea
              placeholder="Message"
              className="border border-neutral-300 bg-white p-4 placeholder:text-neutral-500 focus:border-primary"
              rows={4}
            />
          </div>
        </div>
        <ButtonPrimary className="mt-5 self-center" sizeClass="py-4 px-6">
          Post comment
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default CommentForm;
