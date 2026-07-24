interface Props {
  letter: string;
}

export default function AppointmentCard({
  letter,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h3 className="font-semibold text-slate-700">
          Appointment Letter
        </h3>
      </div>

      <div className="max-h-72 overflow-y-auto whitespace-pre-wrap px-5 py-4 text-sm leading-7 text-slate-700">
        {letter ? (
          letter
        ) : (
          <span className="text-slate-500">
            No appointment letter found.
          </span>
        )}
      </div>
    </div>
  );
}