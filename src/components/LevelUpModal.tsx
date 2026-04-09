import { ActionButton } from './ui/ActionButton';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  return (
    <div className="levelup-overlay" role="dialog" aria-modal="true" aria-labelledby="levelup-title">
      <div className="levelup-card">
        <div className="levelup-ring levelup-ring-a" />
        <div className="levelup-ring levelup-ring-b" />
        <span className="eyebrow">Rank Unlocked</span>
        <h2 id="levelup-title">Level {level}</h2>
        <p>
          Hai sbloccato un nuovo rango operativo. La board ora celebra la tua progressione con avatar,
          activity log e feedback XP piu evidenti.
        </p>
        <ActionButton type="button" onClick={onClose}>
          Continua spedizione
        </ActionButton>
      </div>
    </div>
  );
}
