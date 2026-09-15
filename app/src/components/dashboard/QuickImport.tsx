import { Upload } from "lucide-react";

import type { Fine, Player } from "../../types";
import { importFinesCsv } from "../../utils/csv";

type Props = {
  players: Player[];
  onImport: (fines: Fine[]) => void;
  onNotify: (message: string) => void;
};

export function QuickImport({ players, onImport, onNotify }: Props) {
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imported = await importFinesCsv(file, players);

    if (imported.length === 0) {
      onNotify("Nessuna multa importata");
      event.target.value = "";
      return;
    }

    onImport(imported);

    onNotify(`${imported.length} multe importate`);

    event.target.value = "";
  };

  return (
    <section className="quick-add">
      <div className="quick-icon">
        <Upload size={20} />
      </div>

      <div>
        <strong>Hai una lista di multe?</strong>

        <span>Importa un CSV per aggiungere rapidamente le registrazioni.</span>
      </div>

      <button
        className="secondary-btn"
        onClick={() => document.getElementById("csvInput")?.click()}
      >
        Importa CSV
      </button>

      <input id="csvInput" type="file" accept=".csv,text/csv" hidden onChange={handleFile} />
    </section>
  );
}
