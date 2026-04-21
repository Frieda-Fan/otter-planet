import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { adoptionTraits, ritualSteps } from './data/adoptionContent';

export function AdoptionPage() {
  return (
    <SceneShell
      sceneLabel="Partner Bonding"
      title="专属伙伴领养"
      subtitle="这里先搭情感连接页的第一版，把水獭角色、领养节奏和性格设定表达出来。后续会接语音识别与角色动画状态机。"
    >
      <section className="grid-two">
        <Panel eyebrow="Otter Bond" title="水獭初见">
          <div className="bond-card">
            <div className="bond-card__avatar" aria-hidden="true">
              <img
                className="bond-card__image"
                src={otterCharacterImage}
                alt="等待领养的水獭角色"
              />
              <div className="avatar-spark avatar-spark--one" />
              <div className="avatar-spark avatar-spark--two" />
            </div>
            <div className="bond-card__copy">
              <h3>嗨，我在等你给我起名字。</h3>
              <p>
                当前页面已预留名字、性格、成功庆祝三类状态。后续会把“语音取名成功”“失败兜底默认名”“性格标签同步”接到角色数据上。
              </p>
              <div className="button-row">
                <GlowButton to="/adventure" tone="gold">
                  进入森林冒险骨架
                </GlowButton>
              </div>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Trait System" title="性格设定方向">
          <ul className="check-list">
            {adoptionTraits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Panel>
      </section>

      <section className="grid-single">
        <Panel eyebrow="Onboarding Flow" title="前置仪式链路">
          <div className="steps-row">
            {ritualSteps.map((item) => (
              <article key={item.title} className="step-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
