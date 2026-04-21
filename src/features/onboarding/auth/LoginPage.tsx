import { SceneShell } from '../../../components/layouts/SceneShell';
import { GlowButton } from '../../../components/ui/GlowButton';
import { Panel } from '../../../components/ui/Panel';
import { permissionChecklist } from './data/loginContent';

export function LoginPage() {
  return (
    <SceneShell
      sceneLabel="Access Portal"
      title="登录与权限引导"
      subtitle="这一页不是简单表单，而是面向家长的陪伴式入口。后续会在这里接手机号登录、微信授权与设备权限状态。"
    >
      <section className="grid-two">
        <Panel eyebrow="Guardian Entry" title="极简登录入口">
          <div className="stack-list">
            <div className="metric-card">
              <p className="metric-card__label">登录方式 A</p>
              <h3>手机号一键登录</h3>
              <span>适合 PC / 平板浏览器，后续会接大尺寸数字输入与语音播报。</span>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">登录方式 B</p>
              <h3>微信授权登录</h3>
              <span>适配微信内置浏览器，为传播与邀请链路做准备。</span>
            </div>
            <div className="button-row">
              <GlowButton to="/adopt" tone="gold">
                模拟进入领养流程
              </GlowButton>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Permissions" title="权限说明卡">
          <ul className="check-list">
            {permissionChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="permission-demo">
            <div className="permission-demo__orb permission-demo__orb--camera" />
            <div className="permission-demo__orb permission-demo__orb--voice" />
            <div className="permission-demo__card">
              <strong>童声引导占位</strong>
              <p>请爸爸妈妈帮忙允许摄像头和麦克风权限，这样我们就能一起玩魔法游戏啦。</p>
            </div>
          </div>
        </Panel>
      </section>
    </SceneShell>
  );
}
