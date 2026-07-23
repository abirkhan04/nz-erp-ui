type Props = {
  rows?: number;
  columns?: number;
};

export default function LoadingTable({
  rows = 10,
  columns = 8,
}: Props) {
  return (
    <tbody>
      {[...Array(rows)].map((_, i) => (
        <tr key={i}>
          {[...Array(columns)].map((_, j) => (
            <td
              key={j}
              className="border px-4 py-3"
            >
              <div className="h-4 rounded bg-slate-200 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
