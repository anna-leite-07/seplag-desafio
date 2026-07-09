interface CardProps {
    titulo: string;
    valor: string | number;
    tipo?: 'texto' | 'moeda';
}

export default function Card({ titulo, valor, tipo = 'texto' }: CardProps) {
    const exibir = formatarValor(valor, tipo);
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">{titulo}</p>
            <p className="text-xl font-bold">{exibir}</p>
        </div>
    );
}

function formatarValor(valor: string | number | null | undefined, tipo: 'texto' | 'moeda'): string {
    if (valor === null || valor === undefined || valor === '') {
        return 'Informação não disponível';
    }

    if (tipo === 'moeda') {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor));
    }

    return String(valor);
}