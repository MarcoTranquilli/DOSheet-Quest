interface QuestGlyphProps {
  type: 'compass' | 'spark' | 'crown' | 'shield' | 'trail';
}

export function QuestGlyph({ type }: QuestGlyphProps) {
  switch (type) {
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="quest-glyph">
          <path d="M12 3L13.9 9.1L20 11L13.9 12.9L12 19L10.1 12.9L4 11L10.1 9.1Z" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="quest-glyph">
          <path d="M4 17L6.2 7L11.5 12L16.8 7L20 17Z" />
          <path d="M4 19H20" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="quest-glyph">
          <path d="M12 3L19 6V11C19 15.2 16.2 18.9 12 20C7.8 18.9 5 15.2 5 11V6Z" />
        </svg>
      );
    case 'trail':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="quest-glyph">
          <path d="M5 18C8 12 10 12 12 7C13.6 11 16 11.5 19 6" />
          <path d="M5 18H19" />
        </svg>
      );
    case 'compass':
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="quest-glyph">
          <circle cx="12" cy="12" r="8" />
          <path d="M9 15L11.3 9.8L16 8L13.7 13.2Z" />
        </svg>
      );
  }
}
