import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export default function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">{title}</h3>
      {children}
    </div>
  );
}
