import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from '@mediapipe/tasks-vision';
import type { GestureName, GestureResult } from './gestureTypes';

type Point3D = { x: number; y: number; z: number; t: number };
type CenterPoint = { x: number; y: number; z: number; t: number };

const WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

const IDLE_RESULT: GestureResult = {
  name: 'idle',
  confidence: 0,
  debug: '等待手进入画面',
};

function averageCenter(landmarks: { x: number; y: number; z: number }[]) {
  const total = landmarks.reduce(
    (accumulator, landmark) => ({
      x: accumulator.x + landmark.x,
      y: accumulator.y + landmark.y,
      z: accumulator.z + landmark.z,
    }),
    { x: 0, y: 0, z: 0 },
  );

  return {
    x: total.x / landmarks.length,
    y: total.y / landmarks.length,
    z: total.z / landmarks.length,
  };
}

function trimHistory<T extends { t: number }>(history: T[], windowMs: number) {
  const cutoff = performance.now() - windowMs;
  return history.filter((item) => item.t >= cutoff);
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export async function createHandGestureDetector() {
  const vision = await FilesetResolver.forVisionTasks(WASM_URL);
  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
    },
    runningMode: 'VIDEO',
    numHands: 1,
  });

  let centerHistory: CenterPoint[] = [];
  let tipHistory: Point3D[] = [];
  const lastTriggeredAt = new Map<GestureName, number>();

  function canTrigger(name: GestureName) {
    if (name === 'idle') {
      return true;
    }

    const lastTime = lastTriggeredAt.get(name) ?? 0;
    return performance.now() - lastTime > 800;
  }

  function markTriggered(name: GestureName) {
    if (name !== 'idle') {
      lastTriggeredAt.set(name, performance.now());
    }
  }

  function result(
    name: GestureName,
    confidence: number,
    center?: { x: number; y: number; z: number },
    direction?: GestureResult['direction'],
    debug?: string,
  ): GestureResult {
    return {
      name,
      confidence,
      center,
      direction,
      debug,
    };
  }

  function detectMagicWake(center: CenterPoint) {
    const recent = trimHistory(centerHistory, 1000);

    if (recent.length < 6) {
      return null;
    }

    let changeCount = 0;
    let lastDirection = 0;
    const xs = recent.map((point) => point.x);
    const centerX = xs.reduce((sum, value) => sum + value, 0) / xs.length;
    const maxOffset = Math.max(...xs.map((value) => Math.abs(value - centerX)));
    const totalRange = Math.max(...xs) - Math.min(...xs);

    for (let index = 1; index < recent.length; index += 1) {
      const deltaX = recent[index].x - recent[index - 1].x;
      const direction = Math.abs(deltaX) > 0.03 ? Math.sign(deltaX) : 0;

      if (direction !== 0 && lastDirection !== 0 && direction !== lastDirection) {
        changeCount += 1;
      }

      if (direction !== 0) {
        lastDirection = direction;
      }
    }

    if (changeCount >= 2 && maxOffset > 0.05 && totalRange > 0.1 && canTrigger('magic_wake')) {
      markTriggered('magic_wake');
      return result(
        'magic_wake',
        Math.min(0.99, 0.66 + changeCount * 0.1),
        center,
        undefined,
        `检测到左右唤醒摆动 ${changeCount} 次`,
      );
    }

    return null;
  }

  function detectSwipe(center: CenterPoint) {
    const recent = trimHistory(centerHistory, 600);

    if (recent.length < 4) {
      return null;
    }

    const first = recent[0];
    const last = recent[recent.length - 1];
    const deltaX = last.x - first.x;

    if (deltaX < -0.12 && canTrigger('swipe_left')) {
      markTriggered('swipe_left');
      return result(
        'swipe_left',
        Math.min(0.96, Math.abs(deltaX) * 4),
        center,
        'left',
        `检测到左挥，位移 ${deltaX.toFixed(3)}`,
      );
    }

    if (deltaX > 0.12 && canTrigger('swipe_right')) {
      markTriggered('swipe_right');
      return result(
        'swipe_right',
        Math.min(0.96, Math.abs(deltaX) * 4),
        center,
        'right',
        `检测到右挥，位移 ${deltaX.toFixed(3)}`,
      );
    }

    return null;
  }

  function detectPush(center: CenterPoint) {
    const recent = trimHistory(centerHistory, 600);

    if (recent.length < 4) {
      return null;
    }

    const first = recent[0];
    const last = recent[recent.length - 1];
    const deltaZ = last.z - first.z;

    if (deltaZ < -0.06 && canTrigger('push_forward')) {
      markTriggered('push_forward');
      return result(
        'push_forward',
        Math.min(0.97, Math.abs(deltaZ) * 8),
        center,
        'forward',
        `检测到向前推进，深度变化 ${deltaZ.toFixed(3)}`,
      );
    }

    return null;
  }

  function detectCircle(center: CenterPoint) {
    const recent = trimHistory(tipHistory, 1500);

    if (recent.length < 10) {
      return null;
    }

    const xs = recent.map((point) => point.x);
    const ys = recent.map((point) => point.y);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    const start = recent[0];
    const end = recent[recent.length - 1];
    const closure = distance(start, end);
    const pathLength = recent.slice(1).reduce((sum, point, index) => {
      return sum + distance(recent[index], point);
    }, 0);

    if (
      closure < 0.08 &&
      width > 0.12 &&
      height > 0.12 &&
      pathLength > 0.45 &&
      canTrigger('draw_circle')
    ) {
      markTriggered('draw_circle');
      return result(
        'draw_circle',
        Math.min(0.95, (width + height + pathLength) / 3),
        center,
        'circle',
        `检测到画圈，范围 ${width.toFixed(2)} x ${height.toFixed(2)}`,
      );
    }

    return null;
  }

  function detectTrajectorySpell(center: CenterPoint) {
    const recent = trimHistory(tipHistory, 1500);

    if (recent.length < 8) {
      return null;
    }

    const xs = recent.map((point) => point.x);
    const ys = recent.map((point) => point.y);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    const first = recent[0];
    const middle = recent[Math.floor(recent.length / 2)];
    const last = recent[recent.length - 1];
    const slopeA = middle.x - first.x;
    const slopeB = last.x - middle.x;

    if (
      width > 0.18 &&
      height > 0.18 &&
      Math.sign(slopeA) !== Math.sign(slopeB) &&
      Math.abs(first.y - last.y) < 0.08 &&
      canTrigger('trajectory_spell')
    ) {
      markTriggered('trajectory_spell');
      return result(
        'trajectory_spell',
        0.72,
        center,
        undefined,
        '轨迹像一个 X，已触发轨迹法术',
      );
    }

    if (
      width > 0.14 &&
      height > 0.18 &&
      first.y < middle.y &&
      last.y > middle.y &&
      canTrigger('trajectory_spell')
    ) {
      markTriggered('trajectory_spell');
      return result(
        'trajectory_spell',
        0.68,
        center,
        undefined,
        '轨迹像一个 Y，已触发轨迹法术',
      );
    }

    const nearClosures = recent.filter((point, index) => {
      if (index < 3) {
        return false;
      }

      return distance(point, recent[index - 3]) < 0.04;
    }).length;

    if (nearClosures >= 3 && width > 0.14 && height > 0.14 && canTrigger('trajectory_spell')) {
      markTriggered('trajectory_spell');
      return result(
        'trajectory_spell',
        0.64,
        center,
        undefined,
        '轨迹存在多个小闭环，接近 666 形态',
      );
    }

    return null;
  }

  function updateHistory(resultData: HandLandmarkerResult) {
    const landmarks = resultData.landmarks[0];

    if (!landmarks) {
      centerHistory = [];
      tipHistory = [];
      return null;
    }

    const center = averageCenter(landmarks);
    const now = performance.now();
    const centerPoint = { ...center, t: now };
    const tip = landmarks[8];
    const tipPoint = { x: tip.x, y: tip.y, z: tip.z, t: now };

    centerHistory = [...centerHistory, centerPoint].slice(-36);
    tipHistory = [...tipHistory, tipPoint].slice(-48);

    return centerPoint;
  }

  return {
    detect(video: HTMLVideoElement): GestureResult {
      if (video.readyState < 2) {
        return {
          ...IDLE_RESULT,
          debug: '摄像头还在准备中',
        };
      }

      const detection = handLandmarker.detectForVideo(video, performance.now());
      const center = updateHistory(detection);

      if (!center) {
        return IDLE_RESULT;
      }

      return (
        detectMagicWake(center) ??
        detectSwipe(center) ??
        detectPush(center) ??
        detectCircle(center) ??
        detectTrajectorySpell(center) ??
        result(
          'idle',
          0.2,
          center,
          undefined,
          '已看到手，但还没有形成可触发手势',
        )
      );
    },
    dispose() {
      handLandmarker.close();
      centerHistory = [];
      tipHistory = [];
    },
  };
}
