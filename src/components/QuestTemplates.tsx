import { questTemplates } from '../data/questTemplates';
import { focusLabels, priorityLabels } from '../lib/labels';
import { ActionButton } from './ui/ActionButton';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestItem } from '../types';

interface QuestTemplatesProps {
  onUseTemplate: (quest: QuestItem) => void;
}

export function QuestTemplates({ onUseTemplate }: QuestTemplatesProps) {
  return (
    <PanelCard className="notes-panel">
      <SectionHeading
        eyebrow="Quick Start"
        title="Template pronti"
        description="Preset leggeri per iniziare velocemente senza compilare ogni campo."
      />

      <div className="template-list">
        {questTemplates.map((template) => (
          <ActionButton
            key={template.title}
            type="button"
            variant="ghost"
            className="template-card"
            onClick={() =>
              onUseTemplate({
                ...template,
                id: crypto.randomUUID(),
                completed: false,
                createdAt: new Date().toISOString(),
              })
            }
          >
            <strong>{template.title}</strong>
            <small>{template.note}</small>
            <span>
              {focusLabels[template.focus]} · {priorityLabels[template.priority]} · {template.xp} XP
            </span>
          </ActionButton>
        ))}
      </div>
    </PanelCard>
  );
}
