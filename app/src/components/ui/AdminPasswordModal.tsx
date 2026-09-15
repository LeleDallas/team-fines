import { useState } from "react";
import { Modal } from "./Modal";

type Props = {
  onClose: () => void;
  onUnlock: (password: string) => Promise<void>;
  error: string | null;
};

export function AdminPasswordModal({ onClose, onUnlock, error }: Props) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.trim()) {
      setSubmitting(true);
      try {
        await onUnlock(password);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Modal title="Accesso amministratore" onClose={onClose}>
      <form onSubmit={submit} className="form">
        <label>
          Password
          <input
            autoFocus
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Annulla
          </button>

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Verifica..." : "Accedi"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
