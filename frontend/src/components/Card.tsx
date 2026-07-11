import { formatarValorExibicao } from '../utils/formatters';

interface CardProps {
    titulo: string;
    valor: string | number;
    tipo?: 'texto' | 'moeda';
}

export default function Card({ titulo, valor, tipo = 'texto' }: CardProps) {
    const exibir = formatarValorExibicao(valor, tipo);
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">{titulo}</p>
            <p className="text-xl font-bold">{exibir}</p>
        </div>
    );
}
