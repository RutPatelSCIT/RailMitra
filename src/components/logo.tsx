import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m13 13-6 6" />
      <path d="m10.5 20.5 7-7" />
      <path d="M16 16c-3.5 3.5-6 3.5-9 0s-3.5-5.5 0-9 5.5-3.5 9 0" />
      <path d="M18 8c2-2 3-3.5 3-5s-1-3-3-3-3.5 1-5 3" />
    </svg>
  );
}
