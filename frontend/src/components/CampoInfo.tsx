import { formatarValorExibicao } from '../utils/formatters';

interface CampoInfoProps {
  label: string;
  valor: string | number | null | undefined;
  tipo?: 'texto' | 'moeda';
}

export default function CampoInfo({ label, valor, tipo = 'texto' }: CampoInfoProps) {
  const exibir = formatarValorExibicao(valor, tipo);

  return (
    <p>
      <strong>{label}:</strong> {exibir}
    </p>
  );
}
