import { QuestGlyph } from '../QuestGlyph';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state-panel" role="status" aria-live="polite">
      <div className="empty-state-illustration" aria-hidden="true">
        <div className="empty-orbit empty-orbit-a" />
        <div className="empty-orbit empty-orbit-b" />
        <div className="empty-core">
          <QuestGlyph type="compass" />
        </div>
      </div>

      <div className="empty-state-copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}
