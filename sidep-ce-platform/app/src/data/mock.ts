import type { Regional } from "../types";

export const regionaisSeed: Regional[] = [
  { id: "sefor-1", codigo: "SEFOR-1", nome: "SEFOR 1", tipo: "SEFOR" },
  { id: "sefor-2", codigo: "SEFOR-2", nome: "SEFOR 2", tipo: "SEFOR" },
  { id: "sefor-3", codigo: "SEFOR-3", nome: "SEFOR 3", tipo: "SEFOR" },
  ...Array.from({ length: 20 }, (_, index) => {
    const n = index + 1;
    return {
      id: `crede-${n}`,
      codigo: `CREDE-${n}`,
      nome: `CREDE ${n}`,
      tipo: "CREDE" as const,
    };
  }),
];

