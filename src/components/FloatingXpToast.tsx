interface FloatingXpToastProps {
  xp: number;
  questTitle: string;
}

export function FloatingXpToast({ xp, questTitle }: FloatingXpToastProps) {
  return (
    <div className="floating-xp" role="status" aria-live="polite">
      <div className="floating-xp-burst floating-xp-burst-a" />
      <div className="floating-xp-burst floating-xp-burst-b" />
      <div className="floating-xp-copy">
        <span className="eyebrow">Quest Complete</span>
        <strong>+{xp} XP</strong>
        <p>{questTitle}</p>
      </div>
    </div>
  );
}
