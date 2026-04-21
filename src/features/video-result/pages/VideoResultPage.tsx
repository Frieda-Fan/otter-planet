import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { forestExplorationFirstPersonBackgroundImage } from '../../forest/assets/backgrounds';
import { readForestDemoSnapshot } from '../../forest/utils/demoStorage';

export function VideoResultPage() {
  const snapshot = readForestDemoSnapshot();
  const moonlight = snapshot.completedFlags.length >= 4 ? 100 : 78;

  return (
    <SceneShell
      sceneLabel="Video Result"
      title="冒险结果页"
      subtitle="这一页是当前 demo 的结果输出页，用来承接真月亮揭晓、故事完成和后续视频生成。"
    >
      <section className="grid-single">
        <div className="result-hero result-hero--video">
          <img
            className="result-hero__background"
            src={forestExplorationFirstPersonBackgroundImage}
            alt="冒险结果背景"
          />
          <div className="result-hero__veil" />
          <div className="result-hero__content result-hero__content--spread">
            <div className="result-hero__copy">
              <p className="metric-card__label">Moon Reveal</p>
              <h2>属于这次冒险的真月亮，已经被点亮。</h2>
              <span>
                当前结果页把森林旅程、回顾内容和真月亮展示收束成一个可观看、可分享的成品入口。
              </span>
            </div>
            <div className="moon-result-card">
              <div className="moon-result-card__moon" />
              <div className="moon-result-card__stats">
                <span>完成标记 {snapshot.completedFlags.length}</span>
                <span>系统事件 {snapshot.triggeredEventIds.length}</span>
                <span>月光完成度 {moonlight}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <Panel eyebrow="Result Status" title="当前结果状态">
          <div className="stack-list">
            <div className="metric-card">
              <p className="metric-card__label">State</p>
              <h3>冒险流程已具备可演示闭环</h3>
              <span>
                当前本地存档中累计记录了 {snapshot.triggeredEventIds.length} 个系统事件和
                {' '} {snapshot.completedFlags.length} 个完成标记。
              </span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Moon Result</p>
              <h3>真月亮结果已生成占位</h3>
              <span>后续这里可以接 AI 月亮生成图、封面帧和短视频结果缩略图。</span>
            </div>
            <div className="metric-card metric-card--highlight">
              <p className="metric-card__label">Preview</p>
              <h3>当前已经具备可演示的结果落点</h3>
              <span>现在打开这一页时，已经能让非开发同学直观看到“冒险结束后会得到什么”。</span>
            </div>
            <div className="button-row">
              <GlowButton to="/share" tone="gold">
                进入分享页
              </GlowButton>
              <GlowButton to="/story-retell" tone="forest">
                返回故事回顾
              </GlowButton>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Delivery" title="结果页输出内容">
          <div className="result-delivery-grid">
            <div className="metric-card">
              <p className="metric-card__label">Output A</p>
              <h3>真月亮主图</h3>
              <span>承接孩子最终描述，展示专属月亮形象。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Output B</p>
              <h3>森林回顾卡片</h3>
              <span>把沿路线索、关键角色和故事节点压缩成结果摘要。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Output C</p>
              <h3>视频生成入口</h3>
              <span>后续用于接视频生成进度、重试和下载逻辑。</span>
            </div>
            <div className="result-poster">
              <div className="result-poster__badge">Otter Planet</div>
              <img src={otterCharacterImage} alt="站在结果海报上的水獭角色" />
              <strong>今天和水獭一起找回了月亮</strong>
              <span>这是给家长和孩子一起看的成品海报位，后续可接封面与短视频帧。</span>
            </div>
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
