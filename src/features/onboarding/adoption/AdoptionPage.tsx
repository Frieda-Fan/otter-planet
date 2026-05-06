import { FormEvent, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { otterCharacterImage } from '../../../assets/characters/otter';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { Panel } from '../../../components/ui/Panel';
import { useGestureAction } from '../../../gesture/useGestureAction';
import { type OtterPersonalityTag, useProductSession } from '../../../state';
import { adoptionTraits, ritualSteps } from './data/adoptionContent';

const MAX_TRAIT_COUNT = 2;

export function AdoptionPage() {
  const navigate = useNavigate();
  const { session, patchSession } = useProductSession();
  const [otterName, setOtterName] = useState(session.otterName);
  const [selectedTags, setSelectedTags] = useState<OtterPersonalityTag[]>(session.personalityTags);
  const [gestureTraitIndex, setGestureTraitIndex] = useState(0);
  const [gestureHint, setGestureHint] = useState(
    '可以直接点按钮，也可以打开手势识别后用左右挥动切换性格、向前推动作选中、画圈继续。',
  );

  const toggleTag = useCallback((tag: OtterPersonalityTag) => {
    setSelectedTags((currentTags) => {
      if (currentTags.includes(tag)) {
        return currentTags.filter((currentTag) => currentTag !== tag);
      }

      if (currentTags.length >= MAX_TRAIT_COUNT) {
        return currentTags;
      }

      return [...currentTags, tag];
    });
  }, []);

  const canContinue = otterName.trim().length > 0 && selectedTags.length > 0;
  const focusedTrait = adoptionTraits[gestureTraitIndex];

  const submitAdoption = useCallback(() => {
    if (!canContinue) {
      return;
    }

    patchSession({
      otterName: otterName.trim(),
      personalityTags: selectedTags,
      hasAdopted: true,
    });
    navigate('/adventure');
  }, [canContinue, navigate, otterName, patchSession, selectedTags]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitAdoption();
  };

  useGestureAction(
    useCallback(
      (gesture) => {
        if (gesture.name === 'magic_wake') {
          setGestureHint('手势模式已唤醒，现在可以用挥手和前推动作来挑选性格。');
          return;
        }

        if (gesture.name === 'swipe_left') {
          setGestureTraitIndex((current) => (current - 1 + adoptionTraits.length) % adoptionTraits.length);
          setGestureHint('已切换到上一个性格标签。');
          return;
        }

        if (gesture.name === 'swipe_right') {
          setGestureTraitIndex((current) => (current + 1) % adoptionTraits.length);
          setGestureHint('已切换到下一个性格标签。');
          return;
        }

        if (gesture.name === 'push_forward') {
          toggleTag(focusedTrait.tag);
          setGestureHint(`已切换「${focusedTrait.tag}」的选中状态。`);
          return;
        }

        if (gesture.name === 'draw_circle') {
          if (canContinue) {
            setGestureHint('已通过手势确认，正在进入森林冒险。');
            submitAdoption();
          } else {
            setGestureHint('还需要先输入名字，并至少选中一个性格后才能继续。');
          }
          return;
        }

        if (gesture.name === 'trajectory_spell') {
          setGestureHint('你也可以继续使用鼠标点击，手势和按钮会同时生效。');
        }
      },
      [canContinue, focusedTrait.tag, submitAdoption, toggleTag],
    ),
  );

  const selectedSummary = useMemo(() => {
    if (selectedTags.length === 0) {
      return '请先选择至少一个性格';
    }

    return selectedTags.join(' / ');
  }, [selectedTags]);

  return (
    <SceneShell
      sceneLabel="Otter Bonding"
      title="领养你的森林伙伴"
      subtitle="先给小水獭起名字，再挑选它的性格。按钮点击和手势交互可以同时使用，你可以按自己舒服的方式完成这一步。"
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
              <h3>{otterName.trim() || '它正在等你给它起名字'}</h3>
              <p>
                选好名字和性格以后，这只小水獭就会成为
                {session.childName || '孩子'}
                今晚冒险里的同伴。
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
                placeholder="比如：星星、月牙、小泡泡"
              />
            </label>

            <div className="field">
              <span>选择一到两个最像它的性格</span>
              <div className="trait-grid">
                {adoptionTraits.map((item, index) => {
                  const isSelected = selectedTags.includes(item.tag);
                  const isGestureFocus = index === gestureTraitIndex;

                  return (
                    <button
                      key={item.tag}
                      type="button"
                      className={`trait-chip ${isSelected ? 'is-selected' : ''} ${isGestureFocus ? 'is-gesture-focus' : ''}`}
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
              <p className="metric-card__label">Gesture + Click</p>
              <h3>{otterName.trim() || '还没有名字的小水獭'}</h3>
              <span>{selectedSummary}</span>
            </div>

            <div className="metric-card gesture-helper-card">
              <p className="metric-card__label">可选手势操作</p>
              <h3>当前手势焦点：{focusedTrait.tag}</h3>
              <span>{gestureHint}</span>
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
