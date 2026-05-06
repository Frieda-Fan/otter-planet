import { useGestureContext } from '../gesture/GestureProvider';

export function GestureControlPanel() {
  const {
    currentGesture,
    isActive,
    startGestureSystem,
    stopGestureSystem,
    videoRef,
  } = useGestureContext();

  return (
    <aside className="gesture-debug-panel">
      <div className="gesture-debug-panel__video-wrap">
        <video ref={videoRef} className="gesture-debug-panel__video" />
      </div>

      <div className="gesture-debug-panel__copy">
        <p className="gesture-debug-panel__eyebrow">手势小助手</p>
        <h3>{isActive ? '互动魔法已经醒来' : '挥挥手，叫醒互动魔法'}</h3>
        <dl className="gesture-debug-panel__stats">
          <div>
            <dt>当前动作</dt>
            <dd>{currentGesture.name}</dd>
          </div>
          <div>
            <dt>把握度</dt>
            <dd>{currentGesture.confidence.toFixed(2)}</dd>
          </div>
          <div>
            <dt>中心点</dt>
            <dd>
              {currentGesture.center
                ? `${currentGesture.center.x.toFixed(2)}, ${currentGesture.center.y.toFixed(2)}, ${currentGesture.center.z.toFixed(2)}`
                : '暂时还没有'}
            </dd>
          </div>
          <div>
            <dt>互动状态</dt>
            <dd>{isActive ? '已唤醒' : '待唤醒'}</dd>
          </div>
        </dl>
        <p className="gesture-debug-panel__note">
          {currentGesture.debug ?? '把手放到镜头前，试试左右挥动、推近和画圈。'}
        </p>
      </div>

      <div className="gesture-debug-panel__actions">
        <button
          type="button"
          className="gesture-panel-button gesture-panel-button--primary"
          onClick={() => {
            void startGestureSystem();
          }}
        >
          开启手势识别
        </button>
        <button
          type="button"
          className="gesture-panel-button"
          onClick={stopGestureSystem}
        >
          停止识别
        </button>
      </div>
    </aside>
  );
}
