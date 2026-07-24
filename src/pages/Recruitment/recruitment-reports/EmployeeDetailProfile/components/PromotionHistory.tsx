import type {
  PromotionTransferHistory,
} from "../types/types";

import { formatDate } from "../helpers/employeeDetailHelper";

interface Props {
  history: PromotionTransferHistory[];
}

export default function PromotionHistory({
  history,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h3 className="font-semibold text-slate-700">
          Promotion / Transfer
        </h3>
      </div>

      {history.length === 0 ? (
        <div className="px-5 py-6 text-center text-slate-500">
          No history available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Date
                </th>

                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Type
                </th>

                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  From
                </th>

                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  To
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-5 py-3 text-slate-700">
                    {formatDate(item.date)}
                  </td>

                  <td className="px-5 py-3 text-slate-700">
                    {item.type}
                  </td>

                  <td className="px-5 py-3 text-slate-700">
                    {item.from}
                  </td>

                  <td className="px-5 py-3 text-slate-700">
                    {item.to}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}