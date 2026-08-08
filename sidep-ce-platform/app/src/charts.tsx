import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export type NivelAprendizagem = "critico" | "atencao" | "adequado";

// Faixas de nivel propostas pela coorientacao em 08/08/2026, a validar/ajustar
// pelo professor responsavel pela metodologia pedagogica do projeto.
export const NIVEL_CORTES = { critico: 40, atencao: 70 };

export const NIVEL_CORES: Record<NivelAprendizagem, string> = {
  critico: "#ef3f24",
  atencao: "#f47b20",
  adequado: "#159947",
};

export const NIVEL_LABELS: Record<NivelAprendizagem, string> = {
  critico: `Crítico (0–${NIVEL_CORTES.critico}%)`,
  atencao: `Atenção (${NIVEL_CORTES.critico}–${NIVEL_CORTES.atencao}%)`,
  adequado: `Adequado (${NIVEL_CORTES.atencao}–100%)`,
};

export function nivelAprendizagem(percentual: number): NivelAprendizagem {
  if (percentual < NIVEL_CORTES.critico) return "critico";
  if (percentual < NIVEL_CORTES.atencao) return "atencao";
  return "adequado";
}

export function NivelLegend() {
  return (
    <div className="nivel-legend">
      {(Object.keys(NIVEL_CORES) as NivelAprendizagem[]).map((nivel) => (
        <span className="nivel-legend-item" key={nivel}>
          <i style={{ background: NIVEL_CORES[nivel] }} aria-hidden="true" />
          {NIVEL_LABELS[nivel]}
        </span>
      ))}
    </div>
  );
}

export function PerformanceBarChart({
  items,
  emptyMessage,
}: {
  items: Array<{ label: string; value: number; detalhe?: string }>;
  emptyMessage: string;
}) {
  if (!items.length) return <p className="empty">{emptyMessage}</p>;

  const data = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        label: "% de acerto",
        data: items.map((item) => item.value),
        backgroundColor: items.map((item) => NIVEL_CORES[nivelAprendizagem(item.value)]),
        borderRadius: 4,
        maxBarThickness: 22,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: { callback: (value: string | number) => `${value}%` },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const value = Number(context.parsed.x ?? 0);
            const detalhe = items[context.dataIndex]?.detalhe;
            return `${value}% (${NIVEL_LABELS[nivelAprendizagem(value)]})${detalhe ? ` · ${detalhe}` : ""}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: Math.max(140, items.length * 34) }}>
      <Bar data={data} options={options} />
    </div>
  );
}

const STATUS_CORES: Record<string, string> = {
  rascunho: "#94a3b8",
  agendada: "#0074b8",
  aberta: "#159947",
  encerrada: "#f47b20",
  corrigida: "#06356f",
};

export function StatusDoughnutChart({
  items,
}: {
  items: Array<{ status: string; total: number }>;
}) {
  const comDados = items.filter((item) => item.total > 0);
  if (!comDados.length) return <p className="empty">Ainda não há avaliações cadastradas neste escopo.</p>;

  const data = {
    labels: comDados.map((item) => item.status),
    datasets: [
      {
        data: comDados.map((item) => item.total),
        backgroundColor: comDados.map((item) => STATUS_CORES[item.status] ?? "#94a3b8"),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const, labels: { boxWidth: 12, padding: 12 } },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
