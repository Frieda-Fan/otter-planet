import { useState } from 'react';
import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { useProductSession } from '../../../state';
import { forestExplorationFirstPersonBackgroundImage } from '../../forest/assets/backgrounds';
import { readForestDemoSnapshot } from '../../forest/utils/demoStorage';

export function SharePage() {
  const snapshot = readForestDemoSnapshot();
  const { session } = useProductSession();
  const companionName = session.otterName || '小水獭';
  const [shareNotice, setShareNotice] = useState('');
  const shareCopy = `今天 ${session.childName || '小朋友'} 和 ${companionName} 一起穿过倒悬森林，找回了会回应心愿的月亮。`;

  const handleSavePoster = () => {
    setShareNotice('已经帮你把这张分享卡记进今晚的收藏里。');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareCopy);
      setShareNotice('分享文案已经复制好了。');
    } catch {
      setShareNotice('暂时没有复制成功，可以稍后再试一次。');
    }
  };

  return (
    <SceneShell
      sceneLabel="Share"
      title="把今晚的故事带回家"
      subtitle={`这是 ${session.childName || '小朋友'} 和 ${companionName} 的冒险纪念卡。家长可以保存它，也可以把今晚的旅程分享给家人。`}
    >
      <section className="grid-single">
        <div className="share-stage">
          <img
            className="share-stage__background"
            src={forestExplorationFirstPersonBackgroundImage}
            alt="分享卡背景"
          />
          <div className="share-stage__veil" />
          <div className="share-stage__poster">
            <div className="share-stage__poster-head">
              <p className="metric-card__label">Share Poster</p>
              <h2>今天和{companionName}一起，穿过倒悬森林找回了月亮。</h2>
            </div>
            <div className="share-stage__poster-body">
              <img src={otterCharacterImage} alt={`${companionName}站在分享卡里`} />
              <div className="share-stage__poster-copy">
                <span>完成阶段：{snapshot.completedFlags.length}</span>
                <span>点亮任务：{snapshot.triggeredEventIds.length}</span>
                <span>这张卡适合保存今晚的结果，也适合讲给家人听。</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <Panel eyebrow="分享卡" title="家长现在可以做什么">
          <div className="stack-list">
            <div className="metric-card">
              <p className="metric-card__label">保存纪念</p>
              <h3>把今晚的故事留下来</h3>
              <span>这张卡会收住孩子今晚的发现，也能成为下一次冒险前的回忆入口。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">讲给家人听</p>
              <h3>把旅程分享给最亲近的人</h3>
              <span>不管是转发给家人，还是自己收藏，都像把这趟旅程好好装进了口袋里。</span>
            </div>
            <div className="share-actions">
              <button
                type="button"
                className="chapter-button chapter-button--primary"
                onClick={handleSavePoster}
              >
                保存这张分享卡
              </button>
              <button type="button" className="chapter-button" onClick={handleCopyText}>
                复制今晚的分享文案
              </button>
            </div>
            {shareNotice ? <span className="inline-note">{shareNotice}</span> : null}
            <div className="button-row">
              <GlowButton to="/adventure" tone="gold">
                再玩一次冒险
              </GlowButton>
              <GlowButton to="/" tone="sky">
                回到首页
              </GlowButton>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="今晚已经完成" title="这趟旅程已经走完了一个完整小闭环">
          <div className="stack-list">
            <div className="metric-card">
              <p className="metric-card__label">旅程链路</p>
              <h3>首页 → 领养伙伴 → 森林冒险 → 故事回顾 → 月亮结果 → 分享卡</h3>
              <span>现在用户已经可以完整走完一条从进入到分享的产品链路。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">进度保留</p>
              <h3>刷新后依然可以继续</h3>
              <span>名字、性格、章节进度和互动结果都会被保留下来。</span>
            </div>
            <div className="metric-card metric-card--highlight">
              <p className="metric-card__label">家长价值</p>
              <h3>不仅看见孩子玩了什么，也能看见孩子留下了什么。</h3>
              <span>这会让整条体验更像产品，而不是只看一遍就结束的流程页。</span>
            </div>
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
