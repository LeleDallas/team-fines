import { CheckCircle2 } from "lucide-react";

type Props = {
  message: string;
};

export function Toast({ message }: Props) {
  if (!message) {
    return null;
  }

  return (
    <div className="toast">
      <CheckCircle2 size={18} />
      {message}
    </div>
  );
}
