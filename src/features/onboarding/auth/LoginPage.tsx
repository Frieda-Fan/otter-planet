import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SceneShell } from '../../../components/layouts/SceneShell';
import { Panel } from '../../../components/ui/Panel';
import { useProductSession } from '../../../state';
import { permissionChecklist } from './data/loginContent';

export function LoginPage() {
  const navigate = useNavigate();
  const { session, patchSession } = useProductSession();
  const [guardianName, setGuardianName] = useState(session.guardianName);
  const [childName, setChildName] = useState(session.childName);
  const [agreed, setAgreed] = useState(session.hasEntered);

  const canContinue =
    guardianName.trim().length > 0 && childName.trim().length > 0 && agreed;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canContinue) {
      return;
    }

    patchSession({
      guardianName: guardianName.trim(),
      childName: childName.trim(),
      hasEntered: true,
    });
    navigate('/adopt');
  };

  return (
    <SceneShell
      sceneLabel="Family Entry"
      title="和家长一起进入旅程"
      subtitle="先留下今晚要一起冒险的名字。准备好以后，我们就去认识那只等着被领养的小水獭。"
    >
      <section className="grid-two">
        <Panel eyebrow="今晚的陪伴人" title="先告诉小水獭，你们是谁">
          <form className="product-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>家长称呼</span>
              <input
                type="text"
                value={guardianName}
                onChange={(event) => setGuardianName(event.target.value)}
                placeholder="比如：妈妈、爸爸、Frieda"
              />
            </label>
            <label className="field">
              <span>孩子昵称</span>
              <input
                type="text"
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                placeholder="比如：安安、小月、Mimi"
              />
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
              />
              <span>我们准备好一起开始今晚的森林冒险了。</span>
            </label>
            <div className="button-row">
              <button
                type="submit"
                className="chapter-button chapter-button--primary"
                disabled={!canContinue}
              >
                去认识小水獭
              </button>
            </div>
          </form>
        </Panel>

        <Panel eyebrow="温柔提醒" title="开始前，先看看这三件小事">
          <ul className="check-list">
            {permissionChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="welcome-card">
            <strong>今晚的旅程会先从点击和选择开始。</strong>
            <p>就算还没有接上语音和手势，小水獭也会像真的一样回应你们。</p>
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
