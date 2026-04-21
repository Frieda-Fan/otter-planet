import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { forestExplorationFirstPersonBackgroundImage } from '../../forest/assets/backgrounds';
import { readForestDemoSnapshot } from '../../forest/utils/demoStorage';

export function StoryRetellPage() {
  const snapshot = readForestDemoSnapshot();
  const completedCount = snapshot.completedFlags.length;

  return (
    <SceneShell
      sceneLabel="Story Retell"
      title="故事回顾"
      subtitle="这里承接森林冒险后的回顾阶段，让孩子用自己的话重新讲一遍刚刚经历的旅程。"
    >
      <section className="grid-single">
        <div className="result-hero result-hero--retell">
          <img
            className="result-hero__background"
            src={forestExplorationFirstPersonBackgroundImage}
            alt="故事回顾背景"
          />
          <div className="result-hero__veil" />
          <div className="result-hero__content">
            <div className="result-hero__copy">
              <p className="metric-card__label">Memory Replay</p>
              <h2>把这段倒悬森林的旅程，重新讲成自己的故事。</h2>
              <span>
                已完成 {completedCount} 个关键剧情标记。现在最重要的不是答对，而是把看到的、感受到的、想象到的慢慢说出来。
              </span>
            </div>
            <div className="result-hero__character">
              <img src={otterCharacterImage} alt="陪伴孩子回顾故事的水獭" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <Panel eyebrow="Retell Flow" title="当前回顾状态">
          <div className="stack-list">
            <div className="metric-card">
              <p className="metric-card__label">Progress</p>
              <h3>已完成 {completedCount} 个关键剧情标记</h3>
              <span>这一页是冒险结束后的第一站，用来承接故事复述和记忆整理。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Prompt</p>
              <h3>请你讲讲，水獭一路上看到了什么？</h3>
              <span>后续这里可以接真实语音输入、故事转写和复述结构化分析。</span>
            </div>
            <div className="retell-script">
              <p className="metric-card__label">Demo Script</p>
              <blockquote>
                “我和水獭先看见月亮不见了，然后沿着会发光的花藤路一直往前走。我们看到月瀑、星灯和漂浮晶体，最后真的找回了一轮会回应我们的月亮。”
              </blockquote>
            </div>
            <div className="button-row">
              <GlowButton to="/video-result" tone="gold">
                进入结果页
              </GlowButton>
              <GlowButton to="/adventure" tone="sky">
                返回冒险页
              </GlowButton>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Memory Cards" title="建议保留的回顾片段">
          <div className="memory-grid">
            <div className="metric-card">
              <p className="metric-card__label">片段 A</p>
              <h3>月亮消失的那一刻</h3>
              <span>帮助孩子重新讲出“为什么要出发”。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">片段 B</p>
              <h3>倒悬森林的路</h3>
              <span>引导孩子回忆第一人称探索中看到的月瀑、星灯和晶体。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">片段 C</p>
              <h3>真月亮揭晓</h3>
              <span>承接情绪收束，为结果页和分享页做准备。</span>
            </div>
            <div className="metric-card metric-card--highlight">
              <p className="metric-card__label">回顾目标</p>
              <h3>让孩子把“看到的”变成“说出来的故事”</h3>
              <span>这一页的完成感来自叙述、回忆和再表达，而不是单纯通关。</span>
            </div>
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
