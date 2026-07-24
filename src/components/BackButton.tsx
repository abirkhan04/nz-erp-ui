import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  url: string;
};

export default function BackButton({ url }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-50 hover:border-blue-300"
      onClick={() => navigate(url)}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Reports
    </button>
  );
}