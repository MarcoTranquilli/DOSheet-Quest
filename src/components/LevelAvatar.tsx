interface LevelAvatarProps {
  level: number;
}

function getLevelTier(level: number) {
  if (level >= 5) {
    return {
      tier: 'Pathfinder V',
      accent: 'legend',
      accessory: 'Compass Crown',
      aura: 'Emerald Trail',
    };
  }

  if (level >= 3) {
    return {
      tier: 'Pathfinder III',
      accent: 'adept',
      accessory: 'Scout Mantle',
      aura: 'Amber Pulse',
    };
  }

  return {
    tier: 'Pathfinder I',
    accent: 'rookie',
    accessory: 'Field Badge',
    aura: 'Copper Spark',
  };
}

export function LevelAvatar({ level }: LevelAvatarProps) {
  const meta = getLevelTier(level);

  return (
    <div className={`avatar-card avatar-${meta.accent}`} aria-label={`Avatar livello ${level}`}>
      <div className="avatar-shell">
        <div className="avatar-orbit avatar-orbit-a" />
        <div className="avatar-orbit avatar-orbit-b" />
        <div className="avatar-badge" />
        <div className="avatar-core">
          <div className="avatar-head" />
          <div className="avatar-body" />
        </div>
      </div>

      <div className="avatar-copy">
        <span className="eyebrow">Explorer Rank</span>
        <strong>{meta.tier}</strong>
        <p>
          Accessorio sbloccato: {meta.accessory}. Aura attiva: {meta.aura}.
        </p>
      </div>
    </div>
  );
}
