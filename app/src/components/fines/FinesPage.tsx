import { CheckCircle2, CircleDollarSign, WalletCards, Plus } from "lucide-react";

import type { Fine, FineFilter, Player } from "../../types";

import { currency } from "../../utils/formatting";
import { exportFinesCsv } from "../../utils/csv";

import { Stat } from "../ui/Stat";
import { FineTable } from "./FineTable";

type Props = {
  fines: Fine[];
  pendingFines: Fine[];
  paidFines: Fine[];
  pendingTotal: number;
  paidTotal: number;
  playerMap: Map<string, Player>;
  search: string;
  filter: FineFilter;
  onSearch: (value: string) => void;
  onFilter: (value: FineFilter) => void;
  onAddFine: () => void;
  onEditFine: (fine: Fine) => void;
  onToggleFine: (fine: Fine) => void;
  onDeleteFine: (fine: Fine) => void;
};

export function FinesPage({
  fines,
  pendingFines,
  paidFines,
  pendingTotal,
  paidTotal,
  playerMap,
  search,
  filter,
  onSearch,
  onFilter,
  onAddFine,
  onEditFine,
  onToggleFine,
  onDeleteFine,
}: Props) {
  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">GESTIONE PAGAMENTI</div>

          <h1>Multe</h1>

          <p>Registra, modifica e segna come saldate le multe della squadra.</p>
        </div>

        <button className="primary-btn" onClick={onAddFine}>
          <Plus size={18} />
          Nuova multa
        </button>
      </section>

      <section className="stats-grid fines-stats">
        <Stat
          icon={<CircleDollarSign />}
          label="Da saldare"
          value={currency.format(pendingTotal)}
          detail={`${pendingFines.length} aperte`}
          tone="warning"
        />

        <Stat
          icon={<CheckCircle2 />}
          label="Saldato"
          value={currency.format(paidTotal)}
          detail={`${paidFines.length} chiuse`}
          tone="success"
        />

        <Stat
          icon={<WalletCards />}
          label="Totale multe"
          value={currency.format(pendingTotal + paidTotal)}
          detail={`${fines.length} registrazioni`}
          tone="blue"
        />
      </section>

      <section className="panel table-panel">
        <div className="toolbar">
          <div className="searchbox">
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Cerca giocatore o motivo..."
            />
          </div>

          <div className="filter-tabs">
            {(["all", "pending", "paid"] as const).map((key) => (
              <button
                className={filter === key ? "selected" : ""}
                onClick={() => onFilter(key)}
                key={key}
              >
                {key === "all" ? "Tutte" : key === "pending" ? "Da saldare" : "Saldate"}
              </button>
            ))}
          </div>

          <button className="secondary-btn export-btn" onClick={() => exportFinesCsv(fines)}>
            Esporta CSV
          </button>
        </div>

        <FineTable
          fines={fines}
          playerMap={playerMap}
          onToggle={onToggleFine}
          onEdit={onEditFine}
          onDelete={onDeleteFine}
        />
      </section>
    </>
  );
}
