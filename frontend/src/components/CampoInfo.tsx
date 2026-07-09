interface CampoInfoProps {
  label: string;
  valor: string | number | null | undefined;
  tipo?: 'texto' | 'moeda';
}

export default function CampoInfo({ label, valor, tipo = 'texto' }: CampoInfoProps) {
  const exibir = formatarValor(valor, tipo);

  return (
    <p>
      <strong>{label}:</strong> {exibir}
    </p>
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