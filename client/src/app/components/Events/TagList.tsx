'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

// These are actually categories but we'll keep using "tag"
const tags = [
  'Social Impact',
  'Fundraising',
  'Verified Events',
  'Blockchain',
  'Community',
  'Sustainability',
  'Education',
  'Health & Wellness',
  'Environmental',
];

const TagList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentTag === tag) {
      params.delete('tag'); // unselect if clicked again
    } else {
      params.set('tag', tag);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center flex-nowrap lg:flex-wrap gap-3 w-full overflow-x-scroll">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={clsx(
            'px-4 py-2 text-sm rounded-full border transition-all duration-200 min-w-[150px]',
            currentTag === tag
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagList;
