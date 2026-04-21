import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { forestExplorationFirstPersonBackgroundImage } from '../../forest/assets/backgrounds';
import { readForestDemoSnapshot } from '../../forest/utils/demoStorage';

export function SharePage() {
  const snapshot = readForestDemoSnapshot();

  return (
    <SceneShell
      sceneLabel="Share"
      title="分享页"
      subtitle="这是当前 demo 的最后一站，用来承接家长侧传播、保存结果和再次进入冒险。"
    >
      <section className="grid-single">
        <div className="share-stage">
          <img
            className="share-stage__background"
            src={forestExplorationFirstPersonBackgroundImage}
            alt="分享页背景"
          />
          <div className="share-stage__veil" />
          <div className="share-stage__poster">
            <div className="share-stage__poster-head">
              <p className="metric-card__label">Share Poster</p>
              <h2>今天和水獭一起，穿过倒悬森林找回了月亮。</h2>
            </div>
            <div className="share-stage__poster-body">
              <img src={otterCharacterImage} alt="分享海报中的水獭角色" />
              <div className="share-stage__poster-copy">
                <span>完成阶段：{snapshot.completedFlags.length}</span>
                <span>触发事件：{snapshot.triggeredEventIds.length}</span>
                <span>适合保存为家长分享卡、作品库封面和结果页缩略图。</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <Panel eyebrow="Share Card" title="家长分享卡">
          <div className="stack-list">
            <div className="metric-card">
              <p className="metric-card__label">Summary</p>
              <h3>本次冒险已完成 {snapshot.completedFlags.length} 个阶段</h3>
              <span>这里后续可以放“今天和水獭一起找回了月亮”的分享文案和封面。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">CTA</p>
              <h3>分享给家长 / 保存到作品库</h3>
              <span>当前先保留 UI 结构，后续可接图片导出、链接分享和作品库。</span>
            </div>
            <div className="share-actions">
              <button type="button" className="chapter-button chapter-button--primary">
                保存分享卡
              </button>
              <button type="button" className="chapter-button">
                复制分享文案
              </button>
            </div>
            <div className="button-row">
              <GlowButton to="/adventure" tone="gold">
                再玩一次冒险
              </GlowButton>
              <GlowButton to="/" tone="sky">
                返回首页
              </GlowButton>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Demo Closure" title="当前 demo 已具备">
          <div className="stack-list">
            <div className="metric-card">
              <p className="metric-card__label">Flow</p>
              <h3>开始 - 冒险 - 回顾 - 结果 - 分享</h3>
              <span>现在已经形成一条完整的本地可演示链路。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Persist</p>
              <h3>刷新后仍保留进度</h3>
              <span>本地存档会保存当前章节、完成标记和已触发事件。</span>
            </div>
            <div className="metric-card metric-card--highlight">
              <p className="metric-card__label">Parent Value</p>
              <h3>现在已经能展示“孩子完成后家长会看到什么”</h3>
              <span>这会让 demo 更接近真实产品交付感，而不是纯流程原型。</span>
            </div>
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
