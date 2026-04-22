import { useState } from 'react';
import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { useProductSession } from '../../../state';
import { forestExplorationFirstPersonBackgroundImage } from '../../forest/assets/backgrounds';
import { readForestDemoSnapshot } from '../../forest/utils/demoStorage';

export function StoryRetellPage() {
  const snapshot = readForestDemoSnapshot();
  const { session, patchSession } = useProductSession();
  const completedCount = snapshot.completedFlags.length;
  const companionName = session.otterName || '小水獭';
  const defaultDraft = `我和${companionName}先发现月亮不见了，然后沿着会发光的道路往前走。我们看见了月瀑、星光和晶体，最后真的找回了一轮会回应我们的月亮。`;
  const [retellDraft, setRetellDraft] = useState(session.retellDraft || defaultDraft);
  const [saved, setSaved] = useState(false);

  const handleSaveDraft = () => {
    patchSession({ retellDraft });
    setSaved(true);
  };

  return (
    <SceneShell
      sceneLabel="Story Retell"
      title="今晚的故事回顾"
      subtitle={`现在轮到 ${session.childName || '小朋友'} 和 ${companionName} 一起，把刚刚走过的森林旅程重新讲成自己的故事。`}
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
                你们已经完成了 {completedCount} 个关键旅程节点。现在最重要的，是把看见的、
                感受到的和想象到的，慢慢说出来。
              </span>
            </div>
            <div className="result-hero__character">
              <img src={otterCharacterImage} alt={`${companionName}正在陪你回顾故事`} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <Panel eyebrow="回顾提示" title="可以从这三个片段开始讲">
          <div className="memory-grid">
            <div className="metric-card">
              <p className="metric-card__label">片段一</p>
              <h3>月亮不见的那一刻</h3>
              <span>说说你们为什么出发，又是谁先发现月亮悄悄消失了。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">片段二</p>
              <h3>倒悬森林里的路</h3>
              <span>回忆一路上看见的树冠、月瀑、星光和发亮的晶体。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">片段三</p>
              <h3>真正的月亮醒来了</h3>
              <span>讲讲最后那轮月亮为什么会回应你，以及它像什么。</span>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="回顾脚本" title="给家长和孩子的故事小抄">
          <div className="stack-list">
            <div className="retell-script">
              <p className="metric-card__label">参考说法</p>
              <blockquote>
                “{defaultDraft}”
              </blockquote>
            </div>
            <label className="field">
              <span>把今晚的故事写下来</span>
              <textarea
                className="story-textarea"
                value={retellDraft}
                onChange={(event) => {
                  setRetellDraft(event.target.value);
                  setSaved(false);
                }}
                placeholder="可以让孩子说，家长帮忙记录。"
              />
            </label>
            <div className="share-actions">
              <button type="button" className="chapter-button chapter-button--primary" onClick={handleSaveDraft}>
                保存这一段讲述
              </button>
              {saved ? <span className="inline-note">已经把这段故事记下来了。</span> : null}
            </div>
            <div className="metric-card metric-card--highlight">
              <p className="metric-card__label">回顾目标</p>
              <h3>把“看到的画面”，慢慢变成“说出来的故事”。</h3>
              <span>不需要标准答案，只需要孩子愿意把这趟旅程讲给你听。</span>
            </div>
            <div className="button-row">
              <GlowButton to="/video-result" tone="gold">
                去看今晚的月亮结果
              </GlowButton>
              <GlowButton to="/adventure" tone="sky">
                回到森林继续冒险
              </GlowButton>
            </div>
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
