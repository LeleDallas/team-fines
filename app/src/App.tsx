import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";

import { Dashboard } from "./components/dashboard/Dashboard";
import { CalendarPage } from "./components/calendar/CalendarPage";
import { FinesPage } from "./components/fines/FinesPage";
import { PlayersPage } from "./components/players/PlayersPage";
import { RegolamentoPage } from "./components/regolamento/RegolamentoPage";

import { FineModal } from "./components/fines/FineModal";
import { PlayerModal } from "./components/players/PlayerModal";
import { Toast } from "./components/ui/Toast";

import type { Fine, FineFilter, Page, Player } from "./types";
import { fetchData } from "./api/api";

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<Page>("dashboard");

  const [filter, setFilter] = useState<FineFilter>("all");

  const [search, setSearch] = useState("");

  const [fineModalOpen, setFineModalOpen] = useState(false);

  const [playerModalOpen, setPlayerModalOpen] = useState(false);

  const [editingFine, setEditingFine] = useState<Fine | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [toast, setToast] = useState("");

  const pendingFines = useMemo(() => fines.filter((fine) => fine.status === "pending"), [fines]);

  const paidFines = useMemo(() => fines.filter((fine) => fine.status === "paid"), [fines]);

  const pendingTotal = useMemo(
    () => pendingFines.reduce((total, fine) => total + fine.amount, 0),
    [pendingFines],
  );

  const paidTotal = useMemo(
    () => paidFines.reduce((total, fine) => total + fine.amount, 0),
    [paidFines],
  );

  const playerMap = useMemo(
    () => new Map(players.map((player) => [player.name, player])),
    [players],
  );

  const visibleFines = useMemo(() => {
    return fines
      .filter((fine) => filter === "all" || fine.status === filter)
      .filter((fine) =>
        `${fine.playerName} ${fine.reason}`.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [fines, filter, search]);

  const addFine = (fine: Fine) => {
    setFines((current) => [fine, ...current]);
  };

  const updateFine = (updated: Fine) => {
    setFines((current) => current.map((fine) => (sameFine(fine, editingFine!) ? updated : fine)));
  };

  const saveFine = (fine: Fine) => {
    if (editingFine) {
      updateFine(fine);
    } else {
      addFine(fine);
    }

    setEditingFine(null);
    setFineModalOpen(false);
  };

  const toggleFine = (target: Fine) => {
    setFines((current) =>
      current.map((fine) =>
        sameFine(fine, target)
          ? {
              ...fine,
              status: fine.status === "paid" ? "pending" : "paid",
            }
          : fine,
      ),
    );
  };

  const deleteFine = (target: Fine) => {
    if (!confirm("Eliminare definitivamente questa multa?")) {
      return;
    }

    setFines((current) => current.filter((fine) => !sameFine(fine, target)));
  };

  const openNewFine = () => {
    setEditingFine(null);
    setFineModalOpen(true);
  };

  const openEditFine = (fine: Fine) => {
    setEditingFine(fine);
    setFineModalOpen(true);
  };

  const notify = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2500);
  };

  useEffect(() => {
  async function loadData() {
    try {
      setLoading(true);

      const data = await fetchData();

      setPlayers(data.players);
      setFines(data.fines);
    } catch (error) {
      console.error(error);
      setError("Impossibile caricare i dati");
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, []);

  return (
    <div className="app-shell">
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <Sidebar
        page={page}
        open={sidebarOpen}
        pendingCount={pendingFines.length}
        onNavigate={(nextPage) => {
          setPage(nextPage);
          setSidebarOpen(false);
        }}
      />

      <main className="main">
        <Topbar page={page} onMenu={() => setSidebarOpen((open) => !open)} />

        <div className="content">
          {page === "dashboard" && (
            <Dashboard
              players={players}
              fines={fines}
              pendingFines={pendingFines}
              paidFines={paidFines}
              pendingTotal={pendingTotal}
              paidTotal={paidTotal}
              playerMap={playerMap}
              onAddFine={openNewFine}
              onEditFine={openEditFine}
              onToggleFine={toggleFine}
              onDeleteFine={deleteFine}
              onNavigate={setPage}
            />
          )}

          {page === "fines" && (
            <FinesPage
              fines={visibleFines}
              pendingFines={pendingFines}
              paidFines={paidFines}
              pendingTotal={pendingTotal}
              paidTotal={paidTotal}
              playerMap={playerMap}
              search={search}
              filter={filter}
              onSearch={setSearch}
              onFilter={setFilter}
              onAddFine={openNewFine}
              onEditFine={openEditFine}
              onToggleFine={toggleFine}
              onDeleteFine={deleteFine}
            />
          )}

          {page === "players" && (
            <PlayersPage players={players} fines={fines} onAdd={() => setPlayerModalOpen(true)} />
          )}

          {page === "calendar" && <CalendarPage players={players} />}

          {page === "regolamento" && <RegolamentoPage />}
        </div>
      </main>

      {fineModalOpen && (
        <FineModal
          players={players}
          fine={editingFine}
          onClose={() => {
            setFineModalOpen(false);
            setEditingFine(null);
          }}
          onSave={saveFine}
        />
      )}

      {playerModalOpen && (
        <PlayerModal
          onClose={() => setPlayerModalOpen(false)}
          onSave={(player) => {
            setPlayers((current) => [...current, player]);

            setPlayerModalOpen(false);
          }}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function sameFine(a: Fine, b: Fine) {
  return a.playerName === b.playerName && a.reason === b.reason && a.date === b.date;
}

export default App;
