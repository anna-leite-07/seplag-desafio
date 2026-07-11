interface Coluna<T> {
  cabecalho: string;
  render: (item: T) => React.ReactNode;
  alinhamento?: 'left' | 'right';
}

interface TableProps<T> {
  dados: T[];
  colunas: Coluna<T>[];
  chave: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  tituloLinha?: (item: T) => string | undefined; // tooltip via "title"
  classeLinha?: (item: T) => string; // permite destacar linhas com problema
}

export default function Table<T>({dados, colunas, chave, onRowClick, tituloLinha, classeLinha,}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            {colunas.map((col, i) => (
              <th key={i} className={`p-3 ${col.alinhamento === 'right' ? 'text-right' : 'text-left'}`}>
                {col.cabecalho}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={chave(item)} title={tituloLinha?.(item)} onClick={() => onRowClick?.(item)}
              className={`border-t 
                ${onRowClick ? 'cursor-pointer' : ''} 
                ${classeLinha?.(item) || (onRowClick ? 'hover:bg-gray-300' : '')}`}
            >
              {colunas.map((col, i) => (
                <td key={i} className={`p-3 ${col.alinhamento === 'right' ? 'text-right' : ''}`}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}