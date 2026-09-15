import { CalendarDays, FileText, LayoutDashboard, Users, WalletCards } from "lucide-react";

import type { Page } from "../../types";

type Props = {
  page: Page;
  open: boolean;
  pendingCount: number;
  onNavigate: (page: Page) => void;
  onAdminTap: () => void;
};

export function Sidebar({ page, open, pendingCount, onNavigate, onAdminTap }: Props) {
  const navigate = (nextPage: Page) => {
    onNavigate(nextPage);
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="brand">
        <div className="brand-mark">
          <img
            src="https://torresavio.it/wp-content/uploads/2021/12/Due-Emme.png"
            alt="Due Emme"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>

          <div>
            <strong>Due Emme</strong>
          </div>
        </div>
      </div>

      <div className="sidebar-label">MENU</div>

      <nav>
        <button
          className={page === "dashboard" ? "active" : ""}
          onClick={() => navigate("dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button className={page === "fines" ? "active" : ""} onClick={() => navigate("fines")}>
          <WalletCards size={18} />
          Multe
          <span className="nav-badge">{pendingCount}</span>
        </button>

        <button className={page === "players" ? "active" : ""} onClick={() => navigate("players")}>
          <Users size={18} />
          Rosa
        </button>

        <button className={page === "calendar" ? "active" : ""} onClick={() => navigate("calendar")}>
          <CalendarDays size={18} />
          Calendario
        </button>

        <button
          className={page === "regolamento" ? "active" : ""}
          onClick={() => navigate("regolamento")}
        >
          <FileText size={18} />
          Regolamento
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button className="team-card" onClick={onAdminTap} type="button">
          <div className="team-ball">⚽</div>

          <div>
            <strong>Stagione 2026/27</strong>
          </div>
        </button>
      </div>
    </aside>
  );
}
