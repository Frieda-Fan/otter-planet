import { otterCharacterImage } from '../../../assets/characters/otter';
import { GlowButton } from '../../../components/ui/GlowButton';
import { useProductSession } from '../../../state';
import { forestGeneratedSceneAssets } from '../assets';
import { forestChapterRouteScenes } from '../data/adventureRoutes';
import {
  forestExplorationFirstPersonBackgroundImage,
  forestInvertedCanopyGateImage,
} from '../assets/backgrounds';
import { useAdventureDemoStory } from '../hooks/useAdventureDemoStory';

const chapterBackdropStates = {
  'moon-missing': {
    sceneClassName: 'forest-canvas--chapter-1',
    distanceLabel: '刚刚踏进入口',
    encounterLabel: '遇见第一位领路朋友',
  },
  'glow-trail': {
    sceneClassName: 'forest-canvas--chapter-2',
    distanceLabel: '已经走进森林深处',
    encounterLabel: '在路上遇见温柔倾听者',
  },
  'fake-moon': {
    sceneClassName: 'forest-canvas--chapter-3',
    distanceLabel: '来到了真假月亮交界处',
    encounterLabel: '遇见记忆收藏家',
  },
  'true-moon': {
    sceneClassName: 'forest-canvas--chapter-4',
    distanceLabel: '快走到道路尽头了',
    encounterLabel: '遇见月亮守门人',
  },
} as const;

export function AdventurePage() {
  const { session } = useProductSession();
  const {
    activeChapter,
    chapters,
    completeCurrentChapter,
    dispatchStoryEvent,
    hasStarted,
    isDemoComplete,
    resetDemo,
    startDemo,
    totalReward,
    triggeredEventIds,
  } = useAdventureDemoStory();

  const companionName = session.otterName || '小波';
  const personalityText =
    session.personalityTags.length > 0 ? session.personalityTags.join(' / ') : '勇敢 / 温柔';
  const playerName = session.childName || '小朋友';
  const activeChapterStatus = activeChapter.isCompleted
    ? '这一站完成了'
    : activeChapter.canComplete
      ? '可以进入下一站'
      : activeChapter.isUnlocked
        ? '正在前进中'
        : '旅程还没走到这里';
  const activeChapterIndex = chapters.findIndex((chapter) => chapter.id === activeChapter.id);
  const progressPercent = `${((activeChapterIndex + 1) / chapters.length) * 100}%`;
  const chapterVisualState = chapterBackdropStates[activeChapter.id];
  const completedEvents = activeChapter.events.filter((event) =>
    triggeredEventIds.has(event.id),
  ).length;
  const currentDialogue = activeChapter.dialogue[Math.min(completedEvents, activeChapter.dialogue.length - 1)];
  const routeStages = forestChapterRouteScenes[activeChapter.id];
  const currentRouteStage = routeStages[Math.min(completedEvents, routeStages.length - 1)];

  return (
    <div className="adventure-screen-page">
      <section className={`adventure-stage-board ${chapterVisualState.sceneClassName}`}>
        <img
          className="forest-canvas__backdrop-image"
          src={forestExplorationFirstPersonBackgroundImage}
          alt="倒悬森林深处的主场景"
        />
        <img
          className="forest-canvas__canopy-gate"
          src={forestInvertedCanopyGateImage}
          alt=""
          aria-hidden="true"
        />
        <div className="forest-canvas__veil" />
        <img
          className="adventure-stage-board__tree-cluster"
          src={currentRouteStage.treeAsset}
          alt=""
          aria-hidden="true"
        />
        <img
          className="adventure-stage-board__road-layer"
          src={currentRouteStage.roadAsset}
          alt=""
          aria-hidden="true"
        />
        <img
          className="adventure-stage-board__rock-layer"
          src={currentRouteStage.rockAsset}
          alt=""
          aria-hidden="true"
        />
        <img
          className="forest-canvas__path-guide"
          src={forestGeneratedSceneAssets.forestPathRibbon}
          alt=""
          aria-hidden="true"
        />
        <img
          className="forest-canvas__waterfall-guide"
          src={forestGeneratedSceneAssets.forestWaterfallColumn}
          alt=""
          aria-hidden="true"
        />
        <img
          className="forest-canvas__star forest-canvas__star--left"
          src={forestGeneratedSceneAssets.forestGlowStar}
          alt=""
          aria-hidden="true"
        />
        <img
          className="forest-canvas__star forest-canvas__star--right"
          src={forestGeneratedSceneAssets.forestGlowStar}
          alt=""
          aria-hidden="true"
        />
        {currentRouteStage.effectAsset ? (
          <img
            className="adventure-stage-board__effect-layer"
            src={currentRouteStage.effectAsset}
            alt=""
            aria-hidden="true"
          />
        ) : null}

        <div className="adventure-stage-board__top">
          <div className="adventure-stage-chip-row">
            <span className="adventure-stage-chip">阶段：{activeChapter.label}</span>
            <span className="adventure-stage-chip">夜色：{activeChapter.season}</span>
            <span className="adventure-stage-chip">状态：{activeChapterStatus}</span>
          </div>

          <div className="adventure-stage-progress">
            <div className="journey-progress__track">
              <div className="journey-progress__fill" style={{ width: progressPercent }} />
            </div>
            <span>{chapterVisualState.distanceLabel}</span>
          </div>
        </div>

        <div className="adventure-stage-board__left-card">
          <img
            className="adventure-stage-board__npc-avatar"
            src={activeChapter.npc.imageSrc}
            alt={`${activeChapter.npc.name}的角色形象`}
          />
          <div>
            <p className="metric-card__label">前方伙伴</p>
            <h3>{activeChapter.npc.name}</h3>
            <span>{chapterVisualState.encounterLabel}</span>
          </div>
        </div>

        <div className="adventure-stage-board__right-card">
          <p className="metric-card__label">当前路段</p>
          <h2>{currentRouteStage.title}</h2>
          <p>{currentRouteStage.hint}</p>
          <span>{currentRouteStage.atmosphere}</span>
        </div>

        <div className="adventure-stage-board__route-strip">
          {routeStages.map((stage, index) => {
            const isCurrent = stage.id === currentRouteStage.id;
            const isDone = index < completedEvents;

            return (
              <div
                key={stage.id}
                className={`adventure-route-node ${isCurrent ? 'is-current' : ''} ${isDone ? 'is-done' : ''}`}
              >
                <span className="adventure-route-node__dot" />
                <strong>{stage.title}</strong>
                <small>{stage.hint}</small>
              </div>
            );
          })}
        </div>

        <div className="adventure-stage-board__companion">
          <img src={otterCharacterImage} alt={`${companionName}正在陪你前进`} />
          <div>
            <p className="metric-card__label">陪伴伙伴</p>
            <h3>{companionName}</h3>
            <span>{personalityText}</span>
          </div>
        </div>

        <div className="adventure-stage-board__story">
          <p className="metric-card__label">{currentDialogue.speaker}</p>
          <h3>{currentDialogue.text}</h3>
          <span>
            {playerName} 和 {companionName} 正沿着会发光的道路继续往前走。
          </span>
        </div>

        <div className="adventure-stage-board__actions">
          <div className="adventure-stage-board__actions-head">
            <div>
              <p className="metric-card__label">现在行动</p>
              <h3>
                已完成 {completedEvents}/{activeChapter.events.length} 个任务
              </h3>
            </div>
            <div className="adventure-stage-board__reward">
              <span>星星 {String(totalReward.stars).padStart(4, '0')}</span>
              <span>月光 {totalReward.moonlight}%</span>
            </div>
          </div>

          <div className="adventure-stage-board__action-list">
            {activeChapter.events.map((event) => {
              const isTriggered = triggeredEventIds.has(event.id);

              return (
                <button
                  key={event.id}
                  type="button"
                  className={`adventure-action-button ${isTriggered ? 'is-done' : ''}`}
                  onClick={() => dispatchStoryEvent(event)}
                  disabled={isTriggered || activeChapter.isCompleted}
                >
                  <strong>{event.title}</strong>
                  <span>{event.description}</span>
                </button>
              );
            })}
          </div>

          <div className="adventure-stage-board__action-bar">
            <button
              type="button"
              className="chapter-button chapter-button--primary"
              onClick={startDemo}
            >
              {hasStarted ? '继续前进' : '开始冒险'}
            </button>
            <button
              type="button"
              className="chapter-button"
              onClick={completeCurrentChapter}
              disabled={!activeChapter.canComplete || activeChapter.isCompleted}
            >
              {activeChapter.isCompleted ? '这一站已经完成' : '完成这一站'}
            </button>
            <button type="button" className="chapter-button" onClick={resetDemo}>
              重新开始
            </button>
            {isDemoComplete ? (
              <GlowButton to="/story-retell" tone="gold">
                去看今晚回忆
              </GlowButton>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
