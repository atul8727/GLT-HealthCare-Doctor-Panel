export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b-2 border-primary-light bg-primary-light/40 rounded-t-lg">
            {columns.map((col) => (
              <th key={col} className="text-left font-semibold text-primary/80 py-3 pr-4 whitespace-nowrap first:pl-3 first:rounded-l-lg last:rounded-r-lg">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}
