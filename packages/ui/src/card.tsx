import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <div
      className={className}
     
      rel="noopener noreferrer"
    
    >
     
      {children}
    </div>
  );
}
