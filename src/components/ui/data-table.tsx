interface DataTableProps {
  title: string;
  headers: string[];
  rows: (string | React.ReactNode)[][];
}

export default function DataTable({ title, headers, rows }: DataTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-primary overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-primary">
        <h3 className="font-semibold text-brand-primary">
          {title}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-3 py-4 text-left font-semibold text-brand-primary border-b border-primary border-r border-primary text-xs leading-tight whitespace-normal max-w-24 last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                style={rowIndex === 2 ? { backgroundColor: 'rgba(59, 130, 246, 0.05)' } : {}}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 border-r border-gray-100 text-secondary last:border-r-0 text-sm"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 