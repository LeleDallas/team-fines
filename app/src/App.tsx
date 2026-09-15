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
import { AdminPasswordModal } from "./components/ui/AdminPasswordModal";

import type { Fine, FineFilter, Page, Player } from "./types";
import { fetchData, loginAdmin, uploadData } from "./api/api";

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

  const [dirty, setDirty] = useState(false);

  const [saving, setSaving] = useState(false);

  const [saveError, setSaveError] = useState<string | null>(null);

  const [adminToken, setAdminToken] = useState<string | null>(null);

  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  const [adminTapCount, setAdminTapCount] = useState(0);

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
    setDirty(true);
  };

  const updateFine = (updated: Fine) => {
    setFines((current) => current.map((fine) => (sameFine(fine, editingFine!) ? updated : fine)));
    setDirty(true);
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
    setDirty(true);
  };

  const deleteFine = (target: Fine) => {
    if (!confirm("Eliminare definitivamente questa multa?")) {
      return;
    }

    setFines((current) => current.filter((fine) => !sameFine(fine, target)));
    setDirty(true);
  };

  const saveChanges = async () => {
    if (!adminToken) {
      setAdminModalOpen(true);
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      await uploadData({ players, fines }, adminToken);
      setDirty(false);
    } catch (error) {
      console.error(error);
      setSaveError(error instanceof Error ? error.message : "Impossibile salvare i dati");
      if (error instanceof Error && error.message === "Password amministratore non valida") {
        setAdminToken(null);
        setAdminModalOpen(true);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAdminTap = () => {
    const nextCount = adminTapCount + 1;
    setAdminTapCount(nextCount);

    if (nextCount >= 5) {
      setAdminTapCount(0);
      setAdminModalOpen(true);
    }
  };

  const openNewFine = () => {
    setEditingFine(null);
    setFineModalOpen(true);
  };

  const openEditFine = (fine: Fine) => {
    setEditingFine(fine);
    setFineModalOpen(true);
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
        onAdminTap={handleAdminTap}
      />

      <main className="main">
          <Topbar
            page={page}
            onMenu={() => setSidebarOpen((open) => !open)}
            dirty={dirty}
            saving={saving}
            saveError={saveError}
            onSave={saveChanges}
          />

        <div className="content">
          {loading && <p>Caricamento dati...</p>}

          {!loading && error && <p>{error}</p>}

          {!loading && !error && page === "dashboard" && (
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

          {!loading && !error && page === "fines" && (
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

          {!loading && !error && page === "players" && (
            <PlayersPage players={players} fines={fines} onAdd={() => setPlayerModalOpen(true)} />
          )}

          {!loading && !error && page === "calendar" && <CalendarPage players={players} />}

          {!loading && !error && page === "regolamento" && <RegolamentoPage />}
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
            setDirty(true);

            setPlayerModalOpen(false);
          }}
        />
      )}

      {adminModalOpen && (
        <AdminPasswordModal
          error={adminLoginError}
          onClose={() => {
            setAdminModalOpen(false);
            setAdminLoginError(null);
          }}
          onUnlock={async (password) => {
            try {
              const token = await loginAdmin(password);
              setAdminToken(token);
              setAdminModalOpen(false);
              setAdminLoginError(null);
              setSaveError(null);
            } catch (error) {
              setAdminLoginError(error instanceof Error ? error.message : "Impossibile effettuare il login");
              throw error;
            }
          }}
        />
      )}
    </div>
  );
}

function sameFine(a: Fine, b: Fine) {
  return a.playerName === b.playerName && a.reason === b.reason && a.date === b.date;
}

export default App;
