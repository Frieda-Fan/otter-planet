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
      <div className="dialogue-panel__header dialogue-panel__header--with-portrait">
        <img className="dialogue-panel__portrait" src={npc.imageSrc} alt={`${npc.name}的角色形象`} />
        <div>
          <p className="metric-card__label">正在遇见</p>
          <h3>{npc.name}</h3>
          <span>
            {npc.role} 路 现在心情：{npc.mood}
          </span>
        </div>
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
