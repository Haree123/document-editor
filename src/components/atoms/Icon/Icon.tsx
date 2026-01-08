import React from "react";

export type IconName =
  | "edit"
  | "trash"
  | "comment"
  | "plus"
  | "check"
  | "x"
  | "lock"
  | "unlock"
  | "chevron-down"
  | "chevron-up"
  | "chevronDown"
  | "chevronRight"
  | "sparkles"
  | "send"
  | "save"
  | "compress";

export interface IconProps {
  name: IconName;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const iconPaths: Record<IconName, string> = {
  edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  comment:
    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  plus: "M12 4v16m8-8H4",
  check: "M5 13l4 4L19 7",
  x: "M6 18L18 6M6 6l12 12",
  lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  unlock: "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z",
  "chevron-down": "M19 9l-7 7-7-7",
  "chevron-up": "M5 15l7-7 7 7",
  chevronDown: "M19 9l-7 7-7-7",
  chevronRight: "M9 5l7 7-7 7",
  sparkles:
    "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  send: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  save: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4",
  compress: "M9 9V4.5M9 9H4.5M9 9L3.75 3.75m11.5 11.5V20M15 15h4.5m-4.5 0l5.25 5.25M15 3l-6 6m0 0v4.5M9 9H4.5",
};

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  className = "",
}) => {
  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={iconPaths[name]}
      />
    </svg>
  );
};
