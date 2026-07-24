import { displayValue } from "../helpers/employeeDetailHelper";

interface Props {
  title: string;
  data: [string, any][];
}

export default function InfoCard({
  title,
  data,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h3 className="font-semibold text-slate-700">
          {title}
        </h3>
      </div>

      <div>
        {data.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-1 px-5 py-1"
          >
            <span className="text-sm text-slate-500">
              {label}
            </span>

            <span className="max-w-[60%] break-words text-right font-medium text-slate-900">
              {displayValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}