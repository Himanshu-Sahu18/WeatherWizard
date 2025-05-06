import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className="max-w-md mx-auto mb-8 bg-red-100 border-l-4 border-red-500 p-4 rounded-md text-red-700 dark:bg-red-900/30 dark:text-red-200">
      <div className="flex items-center">
        <AlertCircle className="mr-3 text-red-500" />
        <span>{message}</span>
      </div>
    </div>
  );
}
