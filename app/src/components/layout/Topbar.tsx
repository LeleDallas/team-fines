import { ChevronRight, Menu } from "lucide-react";

import type { Page } from "../../types";

type Props = {
  page: Page;
  onMenu: () => void;
};

const pageLabels: Record<Page, string> = {
  dashboard: "Dashboard",
  fines: "Multe",
  players: "Rosa",
  calendar: "Calendario",
  regolamento: "Regolamento",
};

export function Topbar({ page, onMenu }: Props) {
  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={onMenu}>
        <Menu />
      </button>

      <div className="breadcrumb">
        <span>Due Emme</span>

        <ChevronRight size={15} />

        <strong>{pageLabels[page]}</strong>
      </div>
    </header>
  );
}
