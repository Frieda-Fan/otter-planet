import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { landingHighlights, routeCards } from './data/landingContent';

export function LandingPage() {
  return (
    <SceneShell
      sceneLabel="Otter Planet"
      title="水獭星球"
      subtitle="为 3-8 岁孩子设计的沉浸式奇幻互动入口。第一版前端视觉基线聚焦温暖角色感、发光森林与叙事式页面节奏。"
    >
      <section className="landing-hero">
        <div className="landing-hero__copy">
          <p className="kicker">Moon Rescue Journey</p>
          <h2>和一只会发光的水獭，一起走进倒悬森林。</h2>
          <p>
            我们把产品首页做成一段冒险序章，而不是普通官网。视觉上用夜色森林、晶体、月光丝带和柔软材质，承接你给的参考图。
          </p>
          <div className="button-row">
            <GlowButton to="/login" tone="gold">
              开始搭建体验链路
            </GlowButton>
            <GlowButton to="/adventure" tone="sky">
              查看冒险主容器
            </GlowButton>
          </div>
        </div>

        <div className="otter-stage" aria-hidden="true">
          <div className="otter-stage__moon" />
          <div className="otter-stage__otter">
            <img
              className="otter-stage__image"
              src={otterCharacterImage}
              alt="水獭星球主角水獭"
            />
          </div>
          <div className="otter-stage__ribbon otter-stage__ribbon--one" />
          <div className="otter-stage__ribbon otter-stage__ribbon--two" />
        </div>
      </section>

      <section className="grid-two">
        <Panel eyebrow="Visual Direction" title="首批视觉基线">
          <div className="feature-list">
            {landingHighlights.map((item) => (
              <article key={item.title} className="feature-item">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Phase 1" title="当前已落入代码的页面入口">
          <div className="route-card-list">
            {routeCards.map((item) => (
              <article key={item.to} className="route-card">
                <p>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <span>{item.description}</span>
                <GlowButton to={item.to} tone="forest">
                  {item.cta}
                </GlowButton>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
