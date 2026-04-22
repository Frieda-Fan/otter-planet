import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { useProductSession } from '../../../state';
import { forestExplorationFirstPersonBackgroundImage } from '../../forest/assets/backgrounds';
import { readForestDemoSnapshot } from '../../forest/utils/demoStorage';

export function VideoResultPage() {
  const snapshot = readForestDemoSnapshot();
  const { session } = useProductSession();
  const moonlight = snapshot.completedFlags.length >= 4 ? 100 : 78;
  const companionName = session.otterName || '小水獭';

  return (
    <SceneShell
      sceneLabel="Moon Reveal"
      title="今晚的月亮结果"
      subtitle={`这轮月亮属于 ${session.childName || '小朋友'} 和 ${companionName} 的旅程。现在，它已经被森林轻轻地点亮了。`}
    >
      <section className="grid-single">
        <div className="result-hero result-hero--video">
          <img
            className="result-hero__background"
            src={forestExplorationFirstPersonBackgroundImage}
            alt="月亮结果背景"
          />
          <div className="result-hero__veil" />
          <div className="result-hero__content result-hero__content--spread">
            <div className="result-hero__copy">
              <p className="metric-card__label">Moon Reveal</p>
              <h2>真正的月亮已经亮起来了。</h2>
              <span>
                这是今晚旅程留下来的主结果。它收住了森林里的线索，也留住了孩子一路上的想象。
              </span>
            </div>
            <div className="moon-result-card">
              <div className="moon-result-card__moon" />
              <div className="moon-result-card__stats">
                <span>完成旅程节点 {snapshot.completedFlags.length}</span>
                <span>点亮互动任务 {snapshot.triggeredEventIds.length}</span>
                <span>月光完成度 {moonlight}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <Panel eyebrow="今晚收获" title="这轮月亮为什么属于你们">
          <div className="stack-list">
            <div className="metric-card">
              <p className="metric-card__label">旅程记录</p>
              <h3>一路上的发现都被留住了</h3>
              <span>
                这次旅程里一共完成了 {snapshot.triggeredEventIds.length} 个互动动作，
                每一个动作都帮森林把月亮重新拼了回来。
              </span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">结果感受</p>
              <h3>孩子会看见“我做到了什么”</h3>
              <span>不是单纯通关，而是看见自己真的让一轮月亮重新亮了起来。</span>
            </div>
            <div className="metric-card metric-card--highlight">
              <p className="metric-card__label">下一步</p>
              <h3>现在可以把这份结果做成一张分享卡了。</h3>
              <span>家长可以保存、分享，也可以留作今晚故事的纪念封面。</span>
            </div>
            <div className="button-row">
              <GlowButton to="/share" tone="gold">
                去看看分享卡
              </GlowButton>
              <GlowButton to="/story-retell" tone="forest">
                回到故事回顾
              </GlowButton>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="结果海报" title="这就是今晚会被记住的画面">
          <div className="result-delivery-grid">
            <div className="metric-card">
              <p className="metric-card__label">主画面</p>
              <h3>专属月亮</h3>
              <span>它会成为今晚旅程最重要的结果画面。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">回忆摘要</p>
              <h3>森林里的发现</h3>
              <span>一路上的线索、伙伴和故事节点，都会一起留在结果页里。</span>
            </div>
            <div className="result-poster">
              <div className="result-poster__badge">Otter Planet</div>
              <img src={otterCharacterImage} alt={`${companionName}站在结果海报里`} />
              <strong>今天和{companionName}一起找回了月亮</strong>
              <span>这张结果海报会继续陪你走到分享页，成为今晚故事的纪念封面。</span>
            </div>
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
