import type { ForestResolvedStoryNode } from '../types';

type AdventureTimelineProps = {
  chapters: ForestResolvedStoryNode[];
  activeChapterId: ForestResolvedStoryNode['id'];
  onSelectChapter: (chapterId: ForestResolvedStoryNode['id']) => void;
};

export function AdventureTimeline({
  chapters,
  activeChapterId,
  onSelectChapter,
}: AdventureTimelineProps) {
  return (
    <div className="timeline-list">
      {chapters.map((chapter) => (
        <button
          key={chapter.id}
          type="button"
          className={`timeline-item ${chapter.id === activeChapterId ? 'is-active' : ''}`}
          onClick={() => onSelectChapter(chapter.id)}
          disabled={!chapter.isUnlocked}
        >
          <span className="timeline-item__dot" />
          <div className="timeline-item__content">
            <strong>
              {chapter.label} · {chapter.title}
            </strong>
            <p>{chapter.summary}</p>
            <span className="timeline-item__status">
              {chapter.isCompleted
                ? '已完成'
                : chapter.isUnlocked
                  ? `事件进度 ${chapter.completedEventCount}/${chapter.totalEventCount}`
                  : '尚未解锁'}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
