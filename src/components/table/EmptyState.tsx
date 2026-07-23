type Props = {
  message?: string;
};

export default function EmptyState({
  message = "No records found.",
}: Props) {
  return (
    <div className="flex items-center justify-center h-44 text-slate-500">
      {message}
    </div>
  );
}