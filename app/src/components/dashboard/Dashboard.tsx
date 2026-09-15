import { Cake, CheckCircle2, CircleDollarSign, Plus, Users } from "lucide-react";

import type { Fine, Page, Player } from "../../types";

import { getUpcomingBirthdays } from "../../utils/dates";
import { currency } from "../../utils/formatting";

import { FineTable } from "../fines/FineTable";
import { Stat } from "../ui/Stat";
import { BirthdayList } from "./BirthdayList";

type Props = {
  players: Player[];
  fines: Fine[];
  pendingFines: Fine[];
  paidFines: Fine[];
  pendingTotal: number;
  paidTotal: number;
  playerMap: Map<string, Player>;
  onAddFine: () => void;
  onEditFine: (fine: Fine) => void;
  onToggleFine: (fine: Fine) => void;
  onDeleteFine: (fine: Fine) => void;
  onNavigate: (page: Page) => void;
};

export function Dashboard({
  players,
  fines,
  pendingFines,
  paidFines,
  pendingTotal,
  paidTotal,
  playerMap,
  onAddFine,
  onEditFine,
  onToggleFine,
  onDeleteFine,
  onNavigate,
}: Props) {
  const birthdays = getUpcomingBirthdays(players);

  const recentFines = [...fines].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // const importFines = (imported: Fine[]) => {
  //   // Questo evento viene gestito dall'App.
  //   // Il componente padre può sostituire questa
  //   // funzione quando serve.
  // };

  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">STAGIONE 2026/27</div>

          <h1>
            Pagare e sorridere <span>😃</span>
          </h1>

          <p>Tieni sotto controllo multe, pagamenti e compleanni della squadra.</p>
        </div>

        <button className="primary-btn" onClick={onAddFine}>
          <Plus size={18} />
          Aggiungi multa
        </button>
      </section>

      <section className="stats-grid">
        <Stat
          icon={<CircleDollarSign />}
          label="Da saldare"
          value={currency.format(pendingTotal)}
          detail={`${pendingFines.length} multe aperte`}
          tone="warning"
        />

        <Stat
          icon={<CheckCircle2 />}
          label="Saldato"
          value={currency.format(paidTotal)}
          detail={`${paidFines.length} multe pagate`}
          tone="success"
        />

        <Stat
          icon={<Users />}
          label="Rosa"
          value={String(players.length)}
          detail="giocatori + staff"
          tone="blue"
        />

        <Stat
          icon={<Cake />}
          label="Prossimo compleanno"
          value={birthdays[0]?.player.name ?? "—"}
          detail={
            birthdays[0]
              ? birthdays[0].date.toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                })
              : "Nessuno"
          }
          tone="purple"
        />
      </section>

      <div className="dashboard-grid">
        <section className="panel recent-panel">
          <div className="panel-head">
            <div>
              <h2>Ultime multe</h2>
              <p>Le registrazioni più recenti</p>
            </div>

            <button className="link-btn" onClick={() => onNavigate("fines")}>
              Vedi tutte
            </button>
          </div>

          <FineTable
            fines={recentFines}
            playerMap={playerMap}
            onToggle={onToggleFine}
            onEdit={onEditFine}
            onDelete={onDeleteFine}
            compact
          />
        </section>

        <BirthdayList birthdays={birthdays} onPlayers={() => onNavigate("players")} />
      </div>

      {/* <QuickImport players={players} onNotify={() => {}} /> */}
    </>
  );
}
