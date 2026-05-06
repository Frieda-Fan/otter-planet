import { Camera } from '@mediapipe/camera_utils';
import { Hands, type Results } from '@mediapipe/hands';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type OtterPersonalityTag, useProductSession } from '../../../state';
import { adoptionTraits } from '../adoption/data/adoptionContent';

type OnboardingState =
  | 'waiting_name_wave'
  | 'name_dialog_open'
  | 'waiting_personality_wave'
  | 'personality_panel_open'
  | 'waiting_adventure_wave';

type Zone = 'left' | 'center' | 'right';

type GestureOnboardingProps = {
  otterImage: string;
};

const WAVE_WINDOW_MS = 5000;
const COOLDOWN_MS = 1500;
const CENTER_LEFT = 0.4;
const CENTER_RIGHT = 0.6;
const INPUT_READY_DELAY_MS = 2000;

function getHandCenterX(landmarks: { x: number }[]) {
  const points = [landmarks[0], landmarks[5], landmarks[9], landmarks[13]];
  return points.reduce((sum, point) => sum + point.x, 0) / points.length;
}

function getZone(handX: number): Zone {
  if (handX < CENTER_LEFT) {
    return 'left';
  }

  if (handX > CENTER_RIGHT) {
    return 'right';
  }

  return 'center';
}

export function GestureOnboarding({ otterImage }: GestureOnboardingProps) {
  const navigate = useNavigate();
  const { session, patchSession } = useProductSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const cooldownUntilRef = useRef(0);
  const zoneHistoryRef = useRef<Zone[]>([]);
  const cycleTimesRef = useRef<number[]>([]);
  const lastZoneRef = useRef<Zone>('center');
  const traitSelectedAtRef = useRef(0);
  const stateRef = useRef<OnboardingState>('waiting_name_wave');
  const completeAdoptionRef = useRef<() => void>(() => {});

  const [showTitle, setShowTitle] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [isOtterVisible, setIsOtterVisible] = useState(false);
  const [gestureEnabled, setGestureEnabled] = useState(false);
  const [state, setState] = useState<OnboardingState>('waiting_name_wave');
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [handX, setHandX] = useState<number | null>(null);
  const [waveCount, setWaveCount] = useState(0);
  const [lastTriggerTime, setLastTriggerTime] = useState<string>('未触发');
  const [otterName, setOtterName] = useState(session.otterName);
  const [selectedTag, setSelectedTag] = useState<OtterPersonalityTag | null>(
    session.personalityTags[0] ?? null,
  );
  const [traitSelectionVersion, setTraitSelectionVersion] = useState(0);

  const canConfirmName = otterName.trim().length > 0;
  const canConfirmTrait = Boolean(selectedTag);

  const resetWaveTracking = useCallback(() => {
    zoneHistoryRef.current = [];
    cycleTimesRef.current = [];
    lastZoneRef.current = 'center';
    setWaveCount(0);
  }, []);

  const completeAdoption = useCallback(() => {
    if (!selectedTag || !canConfirmName) {
      return;
    }

    patchSession({
      otterName: otterName.trim(),
      personalityTags: [selectedTag],
      hasAdopted: true,
    });
    navigate('/adventure');
  }, [canConfirmName, navigate, otterName, patchSession, selectedTag]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    completeAdoptionRef.current = completeAdoption;
  }, [completeAdoption]);

  const triggerWaveAction = useCallback(() => {
    const currentState = stateRef.current;

    cooldownUntilRef.current = Date.now() + COOLDOWN_MS;
    setLastTriggerTime(new Date().toLocaleTimeString());
    resetWaveTracking();

    if (currentState === 'waiting_name_wave') {
      setState('name_dialog_open');
      return;
    }

    if (currentState === 'waiting_personality_wave') {
      setState('personality_panel_open');
      return;
    }

    if (currentState === 'waiting_adventure_wave') {
      completeAdoptionRef.current();
    }
  }, [resetWaveTracking]);

  const handleResults = useCallback((results: Results) => {
    const landmarks = results.multiHandLandmarks?.[0];

    if (!landmarks) {
      setHandX(null);
      return;
    }

    const nextHandX = getHandCenterX(landmarks);
    const zone = getZone(nextHandX);
    const now = Date.now();

    setHandX(nextHandX);

    if (
      now < cooldownUntilRef.current ||
      stateRef.current === 'name_dialog_open' ||
      stateRef.current === 'personality_panel_open'
    ) {
      lastZoneRef.current = zone;
      return;
    }

    if (zone !== 'center' && zone !== lastZoneRef.current) {
      zoneHistoryRef.current.push(zone);
      zoneHistoryRef.current = zoneHistoryRef.current.slice(-3);
      lastZoneRef.current = zone;

      const history = zoneHistoryRef.current;
      const isCycle =
        history.length === 3 &&
        history[0] === history[2] &&
        history[0] !== history[1];

      if (isCycle) {
        const nextCycleTimes = [...cycleTimesRef.current, now].filter(
          (time) => now - time <= WAVE_WINDOW_MS,
        );

        cycleTimesRef.current = nextCycleTimes;
        setWaveCount(nextCycleTimes.length);
        zoneHistoryRef.current = [history[2]];

        if (nextCycleTimes.length >= 2) {
          triggerWaveAction();
        }
      }

      return;
    }

    if (zone === 'center') {
      lastZoneRef.current = 'center';
    }
  }, [triggerWaveAction]);

  useEffect(() => {
    const titleTimer = window.setTimeout(() => setShowTitle(true), 1000);
    const fadeTimer = window.setTimeout(() => setHideTitle(true), 4000);
    const otterTimer = window.setTimeout(() => setIsOtterVisible(true), 4500);

    return () => {
      window.clearTimeout(titleTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(otterTimer);
    };
  }, []);

  useEffect(() => {
    if (!gestureEnabled) {
      cameraRef.current?.stop();
      handsRef.current?.close();
      cameraRef.current = null;
      handsRef.current = null;
      setCameraReady(false);
      setPermissionError('');
      setHandX(null);
      resetWaveTracking();
      return;
    }

    const videoElement = videoRef.current;

    if (!(videoElement instanceof HTMLVideoElement)) {
      return;
    }

    const activeVideo = videoElement;
    let disposed = false;

    async function setupHands() {
      try {
        const hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        hands.onResults((results) => {
          if (!disposed) {
            handleResults(results);
          }
        });

        const camera = new Camera(activeVideo, {
          onFrame: async () => {
            if (!disposed) {
              await hands.send({ image: activeVideo });
            }
          },
          width: 640,
          height: 480,
        });

        await camera.start();

        if (disposed) {
          return;
        }

        handsRef.current = hands;
        cameraRef.current = camera;
        setCameraReady(true);
        setPermissionError('');
      } catch {
        setCameraReady(false);
        setPermissionError('请允许摄像头权限以启用挥手交互。');
      }
    }

    void setupHands();

    return () => {
      disposed = true;
      cameraRef.current?.stop();
      handsRef.current?.close();
      cameraRef.current = null;
      handsRef.current = null;
    };
  }, [gestureEnabled, handleResults, resetWaveTracking]);

  useEffect(() => {
    if (!gestureEnabled || state !== 'name_dialog_open' || !canConfirmName) {
      return;
    }

    const inputReadyTimer = window.setTimeout(() => {
      setState('waiting_personality_wave');
      resetWaveTracking();
    }, INPUT_READY_DELAY_MS);

    return () => window.clearTimeout(inputReadyTimer);
  }, [canConfirmName, gestureEnabled, otterName, resetWaveTracking, state]);

  useEffect(() => {
    if (
      !gestureEnabled ||
      state !== 'personality_panel_open' ||
      !selectedTag ||
      traitSelectionVersion === 0 ||
      traitSelectedAtRef.current === 0
    ) {
      return;
    }

    const traitReadyTimer = window.setTimeout(() => {
      setState('waiting_adventure_wave');
      resetWaveTracking();
    }, INPUT_READY_DELAY_MS);

    return () => window.clearTimeout(traitReadyTimer);
  }, [gestureEnabled, resetWaveTracking, selectedTag, state, traitSelectionVersion]);

  const handleOtterClick = useCallback(() => {
    if (state === 'waiting_name_wave' && isOtterVisible) {
      setState('name_dialog_open');
    }
  }, [isOtterVisible, state]);

  const handleConfirmName = useCallback(() => {
    if (!canConfirmName) {
      return;
    }

    setState('personality_panel_open');
    resetWaveTracking();
  }, [canConfirmName, resetWaveTracking]);

  const handleConfirmTrait = useCallback(() => {
    completeAdoption();
  }, [completeAdoption]);

  const debugHandX = useMemo(
    () => (handX === null ? '无' : handX.toFixed(3)),
    [handX],
  );

  return (
    <>
      <section className="starry-landing-hero">
        <div
          className={`starry-landing-title ${showTitle ? 'is-visible' : ''} ${hideTitle ? 'is-hidden' : ''}`}
        >
          <p>OTTER PLANET</p>
          <h1>水獭星球</h1>
        </div>

        <button
          type="button"
          className={`starry-landing-otter ${isOtterVisible ? 'is-visible' : ''}`}
          onClick={handleOtterClick}
        >
          <img src={otterImage} alt="等待领养的小水獭" />
        </button>

        <div className="starry-landing-hint">
          <div className="starry-landing-hint__actions">
            <button
              type="button"
              className={`chapter-button ${gestureEnabled ? 'chapter-button--primary' : ''}`}
              onClick={() => setGestureEnabled(true)}
            >
              使用手势交互
            </button>
          </div>
          <span>
            {gestureEnabled
              ? '手势模式已开启：左右挥手两次可打开当前步骤。'
              : '不点击按钮时，可直接使用鼠标完成取名和性格选择。'}
          </span>
        </div>
      </section>

      {state === 'name_dialog_open' || state === 'waiting_personality_wave' ? (
        <section className="starry-dialog-shell">
          <article className="starry-dialog-card">
            <p className="metric-card__label">Step 1</p>
            <h2>给小水獭取名字</h2>
            <input
              className="starry-dialog-card__input"
              type="text"
              value={otterName}
              onChange={(event) => setOtterName(event.target.value)}
              placeholder="比如：星星、月牙、小泡泡"
            />
            <div className="button-row">
              <button
                type="button"
                className="chapter-button chapter-button--primary"
                onClick={handleConfirmName}
                disabled={!canConfirmName}
              >
                确定
              </button>
            </div>
          </article>
        </section>
      ) : null}

      {state === 'personality_panel_open' || state === 'waiting_adventure_wave' ? (
        <section className="starry-dialog-shell">
          <article className="starry-dialog-card">
            <p className="metric-card__label">Step 2</p>
            <h2>选择一种性格</h2>
            <div className="trait-grid">
              {adoptionTraits.map((item) => {
                const isSelected = selectedTag === item.tag;

                return (
                  <button
                    key={item.tag}
                    type="button"
                    className={`trait-chip ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      traitSelectedAtRef.current = Date.now();
                      setTraitSelectionVersion((version) => version + 1);
                      setSelectedTag(item.tag);
                    }}
                  >
                    <strong>{item.tag}</strong>
                    <span>{item.description}</span>
                  </button>
                );
              })}
            </div>
            <div className="button-row">
              <button
                type="button"
                className="chapter-button chapter-button--primary"
                onClick={handleConfirmTrait}
                disabled={!canConfirmTrait}
              >
                确定
              </button>
            </div>
          </article>
        </section>
      ) : null}

      {gestureEnabled ? (
        <aside className="gesture-onboarding-debug">
          <video ref={videoRef} className="gesture-onboarding-debug__video" muted playsInline />
          <div className="gesture-onboarding-debug__content">
            <span>camera: {cameraReady ? 'on' : 'off'}</span>
            <span>state: {state}</span>
            <span>handX: {debugHandX}</span>
            <span>waveCount: {waveCount}</span>
            <span>lastTrigger: {lastTriggerTime}</span>
            {permissionError ? <strong>{permissionError}</strong> : null}
          </div>
        </aside>
      ) : null}
    </>
  );
}
