/**
 * <Table columns={["A","B"]}>{<tr>...</tr>}</Table>
 * Bordered, rounded table with a soft header row.
 * Tip for row cells: use className="px-5 py-4 text-sm align-middle".
 */
export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
      <table className="min-w-full border-collapse text-sm">
        <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.06em] text-[#64748B]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0]">{children}</tbody>
      </table>
    </div>
  );
}