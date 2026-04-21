import type { ForestDialogueTurn, ForestNpcProfile } from '../types';

type AdventureDialoguePanelProps = {
  npc: ForestNpcProfile;
  dialogue: ForestDialogueTurn[];
};

export function AdventureDialoguePanel({
  npc,
  dialogue,
}: AdventureDialoguePanelProps) {
  const getSpeakerTone = (speaker: ForestDialogueTurn['speaker']) => {
    if (speaker === '旁白') {
      return 'narrator';
    }

    if (speaker === '水獭') {
      return 'otter';
    }

    return 'npc';
  };

  return (
    <div className="dialogue-panel">
      <div className="dialogue-panel__header">
        <p className="metric-card__label">Dialogue Panel</p>
        <h3>{npc.name} 已出场</h3>
        <span>
          {npc.role} · 当前情绪：{npc.mood}
        </span>
      </div>

      <div className="dialogue-list">
        {dialogue.map((turn) => (
          <article
            key={`${turn.speaker}-${turn.text}`}
            className={`dialogue-bubble dialogue-bubble--${getSpeakerTone(turn.speaker)}`}
          >
            <p className="dialogue-bubble__speaker">{turn.speaker}</p>
            <p className="dialogue-bubble__text">{turn.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
