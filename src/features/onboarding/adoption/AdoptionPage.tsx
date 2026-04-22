import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { Panel } from '../../../components/ui/Panel';
import { type OtterPersonalityTag, useProductSession } from '../../../state';
import { adoptionTraits, ritualSteps } from './data/adoptionContent';

const MAX_TRAIT_COUNT = 2;

export function AdoptionPage() {
  const navigate = useNavigate();
  const { session, patchSession } = useProductSession();
  const [otterName, setOtterName] = useState(session.otterName);
  const [selectedTags, setSelectedTags] = useState<OtterPersonalityTag[]>(
    session.personalityTags,
  );

  const toggleTag = (tag: OtterPersonalityTag) => {
    setSelectedTags((currentTags) => {
      if (currentTags.includes(tag)) {
        return currentTags.filter((currentTag) => currentTag !== tag);
      }

      if (currentTags.length >= MAX_TRAIT_COUNT) {
        return currentTags;
      }

      return [...currentTags, tag];
    });
  };

  const canContinue = otterName.trim().length > 0 && selectedTags.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canContinue) {
      return;
    }

    patchSession({
      otterName: otterName.trim(),
      personalityTags: selectedTags,
      hasAdopted: true,
    });
    navigate('/adventure');
  };

  return (
    <SceneShell
      sceneLabel="Otter Bonding"
      title="领养你的森林伙伴"
      subtitle="给这只小水獭取一个名字，再选出一种或两种最像它的性格。准备好以后，它就会陪你一起走进倒悬森林。"
    >
      <section className="grid-two">
        <Panel eyebrow="今晚的新伙伴" title="先和它打个招呼">
          <div className="bond-card">
            <div className="bond-card__avatar" aria-hidden="true">
              <img className="bond-card__image" src={otterCharacterImage} alt="等待领养的小水獭" />
              <div className="avatar-spark avatar-spark--one" />
              <div className="avatar-spark avatar-spark--two" />
            </div>
            <div className="bond-card__copy">
              <h3>{otterName.trim() || '它正在等你给它取名字。'}</h3>
              <p>
                选好名字和性格以后，这只小水獭就会成为今晚冒险里一直陪着
                {session.childName || '你'}
                的伙伴。
              </p>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="完成领养" title="让它成为你的专属小水獭">
          <form className="product-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>给小水獭取个名字</span>
              <input
                type="text"
                value={otterName}
                onChange={(event) => setOtterName(event.target.value)}
                placeholder="比如：星星、月牙、小波"
              />
            </label>
            <div className="field">
              <span>挑选一种或两种最像它的性格</span>
              <div className="trait-grid">
                {adoptionTraits.map((item) => {
                  const isSelected = selectedTags.includes(item.tag);

                  return (
                    <button
                      key={item.tag}
                      type="button"
                      className={`trait-chip ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => toggleTag(item.tag)}
                    >
                      <strong>{item.tag}</strong>
                      <span>{item.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="profile-preview">
              <p className="metric-card__label">伙伴小档案</p>
              <h3>{otterName.trim() || '还没取名字的小水獭'}</h3>
              <span>
                {selectedTags.length > 0 ? selectedTags.join(' / ') : '请先挑选至少一种性格'}
              </span>
            </div>
            <div className="button-row">
              <button
                type="submit"
                className="chapter-button chapter-button--primary"
                disabled={!canContinue}
              >
                带它去森林冒险
              </button>
            </div>
          </form>
        </Panel>
      </section>

      <section className="grid-single">
        <Panel eyebrow="接下来会发生" title="今晚的旅程会这样展开">
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
