import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { useProductSession } from '../../../state';
import { landingHighlights, routeCards } from './data/landingContent';

export function LandingPage() {
  const { hasCompanionProfile, session } = useProductSession();
  const primaryLink = hasCompanionProfile ? '/adventure' : '/login';
  const primaryLabel = hasCompanionProfile ? '继续寻找月亮' : '开始领养小水獭';

  return (
    <SceneShell
      sceneLabel="Otter Planet"
      title="水獭星球"
      subtitle="给 3 到 8 岁孩子准备的晚安冒险。先认识一只小水獭，再一起沿着会发光的道路，去倒悬森林里找回失踪的月亮。"
    >
      <section className="landing-hero">
        <div className="landing-hero__copy">
          <p className="kicker">Moon Rescue Journey</p>
          <h2>今晚，和一只会发光的小水獭一起出发。</h2>
          <p>
            从取名字、选性格，到走进森林、寻找线索，每一步都像真的在冒险。
            {session.otterName ? ` 你的伙伴 ${session.otterName} 已经在等你了。` : ''}
          </p>
          <div className="button-row">
            <GlowButton to={primaryLink} tone="gold">
              {primaryLabel}
            </GlowButton>
            <GlowButton to="/story-retell" tone="sky">
              看看今晚的回忆
            </GlowButton>
          </div>
        </div>

        <div className="otter-stage" aria-hidden="true">
          <div className="otter-stage__moon" />
          <div className="otter-stage__otter">
            <img className="otter-stage__image" src={otterCharacterImage} alt="水獭星球主角小水獭" />
          </div>
          <div className="otter-stage__ribbon otter-stage__ribbon--one" />
          <div className="otter-stage__ribbon otter-stage__ribbon--two" />
        </div>
      </section>

      <section className="grid-two">
        <Panel eyebrow="今晚会遇见" title="孩子会在这里得到什么">
          <div className="feature-list">
            {landingHighlights.map((item) => (
              <article key={item.title} className="feature-item">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="马上开始" title="用三步走进森林冒险">
          <div className="route-card-list">
            {routeCards.map((item) => (
              <article key={item.title} className="route-card">
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
