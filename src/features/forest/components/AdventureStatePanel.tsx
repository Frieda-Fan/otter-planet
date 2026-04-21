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
};

function getSimulatorLabel(source: ForestStoryEventCatalogItem['source']) {
  if (source === 'voice') {
    return '模拟语音识别';
  }

  if (source === 'scene') {
    return '模拟场景反馈';
  }

  if (source === 'gesture') {
    return '模拟手势命中';
  }

  return '模拟剧情触发';
}

export function AdventureStatePanel({
  chapter,
  triggeredEventIds,
  onDispatchEvent,
  onCompleteChapter,
}: AdventureStatePanelProps) {
  return (
    <div className="story-state-card">
      <p className="story-state-card__kicker">Current Chapter</p>
      <h3>
        {chapter.label} · {chapter.title}
      </h3>
      <p>{chapter.summary}</p>
      <div className="story-state-card__meta">
        <span>
          进入条件：
          {chapter.entryFlags.length > 0 ? chapter.entryFlags.join(' / ') : '起始章节，无前置条件'}
        </span>
        <span>完成条件：通过下方模拟输入面板完成本章所需的系统信号后，点亮“完成当前章节”</span>
        <span>奖励变化：{chapter.reward.badge}</span>
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
                {isTriggered ? '已接收' : getSimulatorLabel(event.source)}
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
          {chapter.isCompleted ? '本章已完成' : '完成当前章节'}
        </button>
      </div>
    </div>
  );
}
