import type {
  ForestResolvedStoryNode,
  ForestStoryEventCatalogItem,
  ForestStoryEventId,
} from '../types';

type AdventureStatePanelProps = {
  chapter: ForestResolvedStoryNode;
  triggeredEventIds: Set<ForestStoryEventId>;
  onDispatchEvent: (event: ForestStoryEventCatalogItem) => void;
  onCompleteChapter: () => void;
  companionName: string;
};

function getActionLabel(event: ForestStoryEventCatalogItem) {
  const actionMap: Record<ForestStoryEventCatalogItem['id'], string> = {
    'scene-light-path': '看看前方',
    'story-meet-shanshan': '听它说话',
    'gesture-point-forward': '继续向前',
    'voice-describe-forest': '说说看到什么',
    'scene-crystal-response': '靠近晶体',
    'story-review-clues': '回想线索',
    'gesture-lift-wand': '举起魔法棒',
    'scene-fake-moon-break': '走近月亮',
    'voice-describe-true-moon': '说出心里的月亮',
    'story-final-blessing': '收下祝福',
  };

  return actionMap[event.id];
}

export function AdventureStatePanel({
  chapter,
  triggeredEventIds,
  onDispatchEvent,
  onCompleteChapter,
  companionName,
}: AdventureStatePanelProps) {
  return (
    <div className="story-state-card">
      <p className="story-state-card__kicker">现在可以这样做</p>
      <h3>
        {chapter.label} 路 {chapter.title}
      </h3>
      <p>{chapter.objective}</p>
      <div className="story-state-card__meta">
        <span>完成这一站后，会获得：{chapter.reward.badge}</span>
        <span>
          只要把下面的任务都点亮，{companionName} 就会陪你走向下一段新的路。
        </span>
      </div>

      <div className="story-event-list">
        {chapter.events.map((event) => {
          const isTriggered = triggeredEventIds.has(event.id);

          return (
            <article
              key={event.id}
              className={`story-event-card ${isTriggered ? 'is-done' : ''}`}
            >
              <div>
                <p className="metric-card__label">{event.source}</p>
                <h4>{event.title}</h4>
                <span>{event.description}</span>
              </div>
              <button
                type="button"
                className="chapter-button"
                onClick={() => onDispatchEvent(event)}
                disabled={isTriggered || chapter.isCompleted}
              >
                {isTriggered ? '已经完成' : getActionLabel(event)}
              </button>
            </article>
          );
        })}
      </div>

      <div className="chapter-controls">
        <button
          type="button"
          className="chapter-button chapter-button--primary"
          onClick={onCompleteChapter}
          disabled={!chapter.canComplete || chapter.isCompleted}
        >
          {chapter.isCompleted ? '这一站已经完成' : '完成这一站旅程'}
        </button>
      </div>
    </div>
  );
}
