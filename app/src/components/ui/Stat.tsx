import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  tone: string;
};

export function Stat({ icon, label, value, detail, tone }: Props) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}
