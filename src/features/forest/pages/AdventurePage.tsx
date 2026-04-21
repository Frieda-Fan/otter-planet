import { otterCharacterImage } from '../../../assets/characters/otter';
import { GlowButton } from '../../../components/ui/GlowButton';
import {
  forestGeneratedSceneAssets,
} from '../assets';
import {
  forestExplorationFirstPersonBackgroundImage,
} from '../assets/backgrounds';
import { AdventureStatePanel } from '../components/AdventureStatePanel';
import { AdventureDialoguePanel } from '../components/AdventureDialoguePanel';
import { AdventureTimeline } from '../components/AdventureTimeline';
import {
  forestAdventureModes,
  forestExplorationViewpoints,
  forestLayers,
  forestNpcProfiles,
  forestSceneAssetCards,
} from '../data/adventureContent';
import { useAdventureDemoStory } from '../hooks/useAdventureDemoStory';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { Panel } from '../../../components/ui/Panel';

export function AdventurePage() {
  const {
    activeChapter,
    chapters,
    completedChapterCount,
    completedFlags,
    goToChapter,
    completeCurrentChapter,
    dispatchStoryEvent,
    hasStarted,
    isDemoComplete,
    resetDemo,
    startDemo,
    totalReward,
    triggeredEventIds,
    unlockedChapterCount,
  } = useAdventureDemoStory();

  const activeChapterStatus = activeChapter.isCompleted
    ? '本章已完成'
    : activeChapter.canComplete
      ? '已满足完成条件'
      : activeChapter.isUnlocked
        ? '进行中'
        : '尚未解锁';

  return (
    <SceneShell
      sceneLabel="Forest Runtime"
      title="森林冒险主容器"
      subtitle="这一页先不接训练模块和手势语音引擎，而是优先把“消失的月亮”冒险页搭成可继续生长的剧情场景。现在它已经具备场景舞台、章节信息、任务区、NPC 入口和系统分层说明。"
    >
      <section className="grid-single">
        <Panel eyebrow="Demo Flow" title="演示流程入口">
          <div className="demo-flow-card">
            <div className="demo-flow-card__copy">
              <p className="metric-card__label">Demo Status</p>
              <h3>
                {hasStarted
                  ? isDemoComplete
                    ? '冒险已完成，可继续查看回顾与结果'
                    : '冒险进行中，可继续从当前进度演示'
                  : '还没有开始演示，点击下方按钮进入冒险'}
              </h3>
              <span>
                当前累计星星 {String(totalReward.stars).padStart(4, '0')}，月光值{' '}
                {totalReward.moonlight}%。
              </span>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="chapter-button chapter-button--primary"
                onClick={startDemo}
              >
                {hasStarted ? '继续当前演示' : '开始冒险演示'}
              </button>
              <button type="button" className="chapter-button" onClick={resetDemo}>
                重置本地进度
              </button>
              {isDemoComplete ? (
                <GlowButton to="/story-retell" tone="gold">
                  进入故事回顾
                </GlowButton>
              ) : null}
            </div>
          </div>
        </Panel>
      </section>

      <section className="adventure-layout">
        <div className="forest-canvas forest-canvas--first-person">
          <img
            className="forest-canvas__backdrop-image"
            src={forestExplorationFirstPersonBackgroundImage}
            alt="倒悬森林中的第一人称探索道路背景"
          />
          <div className="forest-canvas__veil" />
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
          <img
            className="forest-canvas__crystal forest-canvas__crystal--left"
            src={forestGeneratedSceneAssets.forestFloatingCrystal}
            alt=""
            aria-hidden="true"
          />
          <img
            className="forest-canvas__crystal forest-canvas__crystal--right"
            src={forestGeneratedSceneAssets.forestFloatingCrystal}
            alt=""
            aria-hidden="true"
          />
          <div className="forest-canvas__camera-note">
            <p className="forest-canvas__objective-label">探索镜头</p>
            <strong>第一人称沿道路推进</strong>
            <span>水獭作为陪跑伙伴出现，主画面始终保持向前穿梭倒悬森林的视角。</span>
          </div>
          <div className="forest-canvas__companion">
            <img
              className="forest-canvas__companion-image"
              src={otterCharacterImage}
              alt="陪跑中的水獭角色"
            />
            <div className="forest-canvas__companion-copy">
              <p className="metric-card__label">Companion</p>
              <h3>陪跑水獭</h3>
              <span>不站在路中央，而是在视角边缘陪你前进、提示和鼓励。</span>
            </div>
          </div>
          <div className="forest-canvas__objective">
            <p className="forest-canvas__objective-label">当前目标</p>
            <h3>{activeChapter.objective}</h3>
            <span>{activeChapter.sceneEvent}</span>
          </div>
          <div className="forest-canvas__hud">
            <div className="hud-chip">季节：{activeChapter.season}</div>
            <div className="hud-chip">章节：{activeChapter.label}</div>
            <div className="hud-chip">状态：{activeChapterStatus}</div>
          </div>
          <div className="forest-canvas__stars">
            <span>星星 {String(activeChapter.reward.stars).padStart(4, '0')}</span>
            <span>月光值 {activeChapter.reward.moonlight}%</span>
          </div>
        </div>

        <div className="adventure-sidebar">
          <Panel eyebrow="Story Runtime" title="主线推进节点">
            <AdventureTimeline
              chapters={chapters}
              activeChapterId={activeChapter.id}
              onSelectChapter={goToChapter}
            />
          </Panel>

          <Panel eyebrow="Dialogue Layer" title="NPC 对话面板">
            <AdventureDialoguePanel
              npc={activeChapter.npc}
              dialogue={activeChapter.dialogue}
            />
          </Panel>

          <Panel eyebrow="Adventure Modes" title="页面承载的三种模式">
            <div className="stack-list">
              {forestAdventureModes.map((item) => (
                <div
                  key={item.title}
                  className={`metric-card ${item.title === activeChapter.mode ? 'is-active' : ''}`}
                >
                  <p className="metric-card__label">Mode</p>
                  <h3>{item.title}</h3>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="grid-two adventure-secondary">
        <Panel eyebrow="Chapter Control" title="章节节点流控制台">
          <AdventureStatePanel
            chapter={activeChapter}
            triggeredEventIds={triggeredEventIds}
            onDispatchEvent={dispatchStoryEvent}
            onCompleteChapter={completeCurrentChapter}
          />
        </Panel>

        <Panel eyebrow="Scene Layers" title="冒险页分层">
          <div className="layer-list">
            {forestLayers.map((item) => (
              <div key={item} className="layer-item">
                <span className="layer-item__bar" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="NPC Entry" title="森林角色关系">
          <div className="npc-grid">
            {forestNpcProfiles.map((item) => (
              <article
                key={item.name}
                className={`npc-card ${item.name === activeChapter.npc.name ? 'npc-card--active' : ''}`}
              >
                <p className="metric-card__label">{item.role}</p>
                <h3>{item.name}</h3>
                <span>{item.description}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid-two adventure-secondary">
        <Panel eyebrow="View Grammar" title="探索模式镜头语法">
          <div className="layer-list">
            {forestExplorationViewpoints.map((item) => (
              <div key={item} className="layer-item">
                <span className="layer-item__bar" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Scene Assets" title="本轮生成素材">
          <div className="stack-list">
            {forestSceneAssetCards.map((item) => (
              <article key={item.name} className="metric-card">
                <p className="metric-card__label">{item.type}</p>
                <h3>{item.name}</h3>
                <span>{item.description}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid-single">
        <Panel eyebrow="Next Hooks" title="后续接入点">
          <div className="hook-grid">
            <div className="metric-card">
              <p className="metric-card__label">Quest State</p>
              <h3>剧情状态机入口</h3>
              <span>
                已解锁 {unlockedChapterCount} / {chapters.length} 章，已完成{' '}
                {completedChapterCount} 章。
              </span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Dialogue Layer</p>
              <h3>对话与旁白容器</h3>
              <span>当前已经用本地章节数据驱动旁白、水獭和 NPC 的演示对话。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Scene Events</p>
              <h3>场景事件占位</h3>
              <span>{activeChapter.sceneEvent}</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Unlock Flags</p>
              <h3>统一状态入口</h3>
              <span>
                {completedFlags.size > 0
                  ? Array.from(completedFlags).join(' / ')
                  : '当前还没有完成标记，适合从第一章开始演示。'}
              </span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Demo Closure</p>
              <h3>演示闭环出口</h3>
              <span>
                {isDemoComplete
                  ? '已解锁故事回顾、结果页和分享页，可完整演示闭环。'
                  : '完成全部章节后，会自动进入“回顾 -> 结果 -> 分享”的演示闭环。'}
              </span>
            </div>
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
