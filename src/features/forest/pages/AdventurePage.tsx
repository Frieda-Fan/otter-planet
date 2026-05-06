import { useCallback, useMemo, useState } from 'react';
import { otterCharacterImage } from '../../../assets/characters/otter';
import { GlowButton } from '../../../components/ui/GlowButton';
import { useGestureAction } from '../../../gesture/useGestureAction';
import { useProductSession } from '../../../state';
import { forestGeneratedSceneAssets } from '../assets';
import {
  forestExplorationFirstPersonBackgroundImage,
  forestInvertedCanopyGateImage,
} from '../assets/backgrounds';
import { forestChapterRouteScenes } from '../data/adventureRoutes';
import { NpcInteractionModel, RouteActionModel } from '../models/AdventureInteractionModels';
import { AdventureSceneModel } from '../models/AdventureSceneModels';
import { useAdventureDemoStory } from '../hooks/useAdventureDemoStory';

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
  const [gestureFocusIndex, setGestureFocusIndex] = useState(0);
  const [gestureHint, setGestureHint] = useState(
    '按钮点击和手势交互都可用。画圈开始冒险，左右挥动切换焦点，前推动作执行当前焦点。',
  );

  const companionName = session.otterName || '小波';
  const personalityText =
    session.personalityTags.length > 0 ? session.personalityTags.join(' / ') : '勇敢 / 温柔';
  const playerName = session.childName || '小朋友';

  const sceneModel = new AdventureSceneModel(
    activeChapter,
    forestChapterRouteScenes[activeChapter.id],
    activeChapter.completedEventCount,
    chapters.findIndex((chapter) => chapter.id === activeChapter.id),
    chapters.length,
  );

  const actionModels = activeChapter.events.map(
    (event) => new RouteActionModel(event, triggeredEventIds.has(event.id), activeChapter.isCompleted),
  );
  const npcInteractionModel = new NpcInteractionModel(
    activeChapter,
    sceneModel.currentRouteStage,
    actionModels,
  );

  const gestureControls = useMemo(() => {
    const controls: Array<{
      id: string;
      label: string;
      disabled: boolean;
      action: () => void;
    }> = [
      {
        id: 'start-demo',
        label: hasStarted ? '继续前进' : '开始冒险',
        disabled: false,
        action: startDemo,
      },
      ...actionModels.map((actionModel) => ({
        id: actionModel.event.id,
        label: actionModel.buttonLabel,
        disabled: actionModel.disabled,
        action: () => dispatchStoryEvent(actionModel.event),
      })),
      {
        id: 'complete-chapter',
        label: activeChapter.isCompleted ? '本章已完成' : '完成这一章',
        disabled: !activeChapter.canComplete || activeChapter.isCompleted,
        action: completeCurrentChapter,
      },
      {
        id: 'reset-demo',
        label: '重新开始',
        disabled: false,
        action: resetDemo,
      },
    ];

    return controls;
  }, [
    actionModels,
    activeChapter.canComplete,
    activeChapter.isCompleted,
    completeCurrentChapter,
    dispatchStoryEvent,
    hasStarted,
    resetDemo,
    startDemo,
  ]);

  const focusedControl = gestureControls[gestureFocusIndex] ?? gestureControls[0];

  useGestureAction(
    useCallback(
      (gesture) => {
        if (gesture.name === 'magic_wake') {
          setGestureHint('手势模式已唤醒，可以开始用挥手和前推动作控制冒险。');
          return;
        }

        if (gesture.name === 'draw_circle') {
          startDemo();
          setGestureHint('已通过手势开始冒险。');
          return;
        }

        if (gesture.name === 'swipe_left') {
          setGestureFocusIndex((current) => (current - 1 + gestureControls.length) % gestureControls.length);
          setGestureHint('已切换到上一个可执行动作。');
          return;
        }

        if (gesture.name === 'swipe_right') {
          setGestureFocusIndex((current) => (current + 1) % gestureControls.length);
          setGestureHint('已切换到下一个可执行动作。');
          return;
        }

        if (gesture.name === 'push_forward') {
          if (!focusedControl?.disabled) {
            focusedControl.action();
            setGestureHint(`已执行「${focusedControl.label}」。`);
          } else {
            setGestureHint(`当前焦点「${focusedControl?.label ?? '动作'}」暂时不可执行。`);
          }
          return;
        }

        if (gesture.name === 'trajectory_spell') {
          if (activeChapter.canComplete && !activeChapter.isCompleted) {
            completeCurrentChapter();
            setGestureHint('已通过手势尝试完成当前章节。');
          } else {
            setGestureHint('轨迹手势已识别。你也可以继续使用按钮点击推进剧情。');
          }
        }
      },
      [activeChapter.canComplete, activeChapter.isCompleted, completeCurrentChapter, focusedControl, gestureControls.length, startDemo],
    ),
  );

  return (
    <div className="adventure-screen-page">
      <section className={`adventure-stage-board ${sceneModel.backdrop.sceneClassName}`}>
        <img
          className="forest-canvas__backdrop-image"
          src={forestExplorationFirstPersonBackgroundImage}
          alt="森林冒险背景"
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
          src={sceneModel.currentRouteStage.treeAsset}
          alt=""
          aria-hidden="true"
        />
        <img
          className="adventure-stage-board__road-layer"
          src={sceneModel.currentRouteStage.roadAsset}
          alt=""
          aria-hidden="true"
        />
        <img
          className="adventure-stage-board__rock-layer"
          src={sceneModel.currentRouteStage.rockAsset}
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
        {sceneModel.currentRouteStage.effectAsset ? (
          <img
            className="adventure-stage-board__effect-layer"
            src={sceneModel.currentRouteStage.effectAsset}
            alt=""
            aria-hidden="true"
          />
        ) : null}

        <div className="adventure-stage-board__top">
          <div className="adventure-stage-chip-row">
            <span className="adventure-stage-chip">阶段：{activeChapter.label}</span>
            <span className="adventure-stage-chip">夜色：{activeChapter.season}</span>
            <span className="adventure-stage-chip">状态：{sceneModel.statusLabel}</span>
          </div>

          <div className="adventure-stage-progress">
            <div className="journey-progress__track">
              <div className="journey-progress__fill" style={{ width: sceneModel.progressPercent }} />
            </div>
            <span>{sceneModel.backdrop.distanceLabel}</span>
          </div>
        </div>

        <div className="adventure-stage-board__left-card">
          <img
            className="adventure-stage-board__npc-avatar"
            src={npcInteractionModel.npc.imageSrc}
            alt={npcInteractionModel.npc.name}
          />
          <div>
            <p className="metric-card__label">前方伙伴</p>
            <h3>{npcInteractionModel.npc.name}</h3>
            <span>{sceneModel.backdrop.encounterLabel}</span>
          </div>
        </div>

        <div className="adventure-stage-board__right-card">
          <p className="metric-card__label">当前路段</p>
          <h2>{sceneModel.currentRouteStage.title}</h2>
          <p>{sceneModel.currentRouteStage.hint}</p>
          <span>{sceneModel.currentRouteStage.atmosphere}</span>
        </div>

        <div className="adventure-stage-board__route-strip">
          {sceneModel.routeNodes.map((routeNode) => (
            <div
              key={routeNode.stage.id}
              className={`adventure-route-node ${routeNode.isCurrent ? 'is-current' : ''} ${routeNode.isDone ? 'is-done' : ''}`}
            >
              <span className="adventure-route-node__dot" />
              <strong>{routeNode.stage.title}</strong>
              <small>{routeNode.stage.hint}</small>
            </div>
          ))}
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
          <p className="metric-card__label">{npcInteractionModel.currentDialogue.speaker}</p>
          <h3>{npcInteractionModel.currentDialogue.text}</h3>
          <span>
            {npcInteractionModel.prompt}
            {' '}
            {playerName} 和 {companionName} 可以自由选择点击或手势来推进。
          </span>
        </div>

        <div className="adventure-stage-board__actions">
          <div className="adventure-stage-board__actions-head">
            <div>
              <p className="metric-card__label">现在行动</p>
              <h3>
                已完成 {activeChapter.completedEventCount}/{activeChapter.totalEventCount} 个任务
              </h3>
            </div>
            <div className="adventure-stage-board__reward">
              <span>星星 {String(totalReward.stars).padStart(4, '0')}</span>
              <span>月光 {totalReward.moonlight}%</span>
            </div>
          </div>

          <div className="metric-card gesture-helper-card">
            <p className="metric-card__label">Gesture + Click</p>
            <h3>当前手势焦点：{focusedControl?.label ?? '开始冒险'}</h3>
            <span>{gestureHint}</span>
          </div>

          <div className="adventure-stage-board__action-list">
            {actionModels.map((actionModel) => {
              const isGestureFocus = focusedControl?.id === actionModel.event.id;

              return (
                <button
                  key={actionModel.event.id}
                  type="button"
                  className={`adventure-action-button ${actionModel.done ? 'is-done' : ''} ${isGestureFocus ? 'is-gesture-focus' : ''}`}
                  onClick={() => dispatchStoryEvent(actionModel.event)}
                  disabled={actionModel.disabled}
                >
                  <strong>{actionModel.buttonLabel}</strong>
                  <span>{actionModel.helperText}</span>
                </button>
              );
            })}
          </div>

          <div className="adventure-stage-board__action-bar">
            <button
              type="button"
              className={`chapter-button chapter-button--primary ${focusedControl?.id === 'start-demo' ? 'is-gesture-focus' : ''}`}
              onClick={startDemo}
            >
              {hasStarted ? '继续前进' : '开始冒险'}
            </button>
            <button
              type="button"
              className={`chapter-button ${focusedControl?.id === 'complete-chapter' ? 'is-gesture-focus' : ''}`}
              onClick={completeCurrentChapter}
              disabled={!activeChapter.canComplete || activeChapter.isCompleted}
            >
              {activeChapter.isCompleted ? '这一章已经完成' : '完成这一章'}
            </button>
            <button
              type="button"
              className={`chapter-button ${focusedControl?.id === 'reset-demo' ? 'is-gesture-focus' : ''}`}
              onClick={resetDemo}
            >
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
