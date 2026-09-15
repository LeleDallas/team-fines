import { Check, ChevronRight, LoaderCircle, Menu, Save } from "lucide-react";

import type { Page } from "../../types";

type Props = {
  page: Page;
  onMenu: () => void;
  dirty: boolean;
  saving: boolean;
  saveError: string | null;
  onSave: () => void;
};

const pageLabels: Record<Page, string> = {
  dashboard: "Dashboard",
  fines: "Multe",
  players: "Rosa",
  calendar: "Calendario",
  regolamento: "Regolamento",
};

export function Topbar({ page, onMenu, dirty, saving, saveError, onSave }: Props) {
  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={onMenu}>
        <Menu />
      </button>

      <div className="topbar-left">
        <div className="breadcrumb">
          <span>Due Emme</span>

          <ChevronRight size={15} />

          <strong>{pageLabels[page]}</strong>
        </div>

        {saveError && <span className="save-error">{saveError}</span>}
      </div>

      <button className="primary-btn save-btn" onClick={onSave} disabled={!dirty || saving}>
        {saving ? <LoaderCircle className="spin" size={17} /> : dirty ? <Save size={17} /> : <Check size={17} />}
        {saving ? "Salvataggio..." : dirty ? "Salva modifiche" : "Salvato"}
      </button>
    </header>
  );
}
