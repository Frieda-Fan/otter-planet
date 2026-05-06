import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PropsWithChildren,
} from 'react';
import { startCamera } from './camera';
import { createHandGestureDetector } from './gestureDetector';
import type { GestureResult } from './gestureTypes';

type GestureContextValue = {
  currentGesture: GestureResult;
  isActive: boolean;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  attachVideoRef: (node: HTMLVideoElement | null) => void;
  startGestureSystem: () => Promise<void>;
  restartGestureSystem: () => Promise<void>;
  stopGestureSystem: () => void;
};

const GestureContext = createContext<GestureContextValue | null>(null);

const idleGesture: GestureResult = {
  name: 'idle',
  confidence: 0,
  debug: '手势系统尚未开启',
};

export function GestureProvider({ children }: PropsWithChildren) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const detectorRef = useRef<Awaited<ReturnType<typeof createHandGestureDetector>> | null>(null);
  const stopCameraRef = useRef<(() => void) | null>(null);
  const frameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const isActiveRef = useRef(false);
  const pendingAutoStartRef = useRef(false);

  const [currentGesture, setCurrentGesture] = useState<GestureResult>(idleGesture);
  const [isActive, setIsActive] = useState(false);

  const stopGestureSystem = useCallback(() => {
    isRunningRef.current = false;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (stopCameraRef.current) {
      stopCameraRef.current();
      stopCameraRef.current = null;
    }

    if (detectorRef.current) {
      detectorRef.current.dispose();
      detectorRef.current = null;
    }

    setIsActive(false);
    isActiveRef.current = false;
    setCurrentGesture(idleGesture);
  }, []);

  const startGestureSystem = useCallback(async () => {
    if (!videoRef.current) {
      pendingAutoStartRef.current = true;
      return;
    }

    if (isRunningRef.current) {
      return;
    }

    const videoElement = videoRef.current;
    pendingAutoStartRef.current = false;
    isRunningRef.current = true;

    try {
      stopCameraRef.current = await startCamera(videoElement);
      detectorRef.current = await createHandGestureDetector();

      const loop = () => {
        if (!isRunningRef.current || !detectorRef.current || !videoRef.current) {
          return;
        }

        const nextGesture = detectorRef.current.detect(videoRef.current);

        if (nextGesture.name === 'magic_wake') {
          isActiveRef.current = true;
          setIsActive(true);
          setCurrentGesture(nextGesture);
        } else if (isActiveRef.current || nextGesture.name === 'idle') {
          setCurrentGesture(nextGesture);
        } else {
          setCurrentGesture({
            ...idleGesture,
            center: nextGesture.center,
            debug: '先左右轻轻挥手，唤醒互动魔法',
          });
        }

        frameRef.current = requestAnimationFrame(loop);
      };

      frameRef.current = requestAnimationFrame(loop);
    } catch (error) {
      isRunningRef.current = false;
      stopGestureSystem();
      setCurrentGesture({
        name: 'idle',
        confidence: 0,
        debug: error instanceof Error ? error.message : '手势系统启动失败',
      });
    }
  }, [stopGestureSystem]);

  const restartGestureSystem = useCallback(async () => {
    stopGestureSystem();
    pendingAutoStartRef.current = true;

    await new Promise((resolve) => {
      window.setTimeout(resolve, 80);
    });

    await startGestureSystem();
  }, [startGestureSystem, stopGestureSystem]);

  const attachVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;

    if (node && pendingAutoStartRef.current) {
      void startGestureSystem();
    }
  }, [startGestureSystem]);

  useEffect(() => {
    return () => {
      stopGestureSystem();
    };
  }, [stopGestureSystem]);

  const value = useMemo(
    () => ({
      currentGesture,
      isActive,
      videoRef,
      attachVideoRef,
      startGestureSystem,
      restartGestureSystem,
      stopGestureSystem,
    }),
    [attachVideoRef, currentGesture, isActive, restartGestureSystem, startGestureSystem, stopGestureSystem],
  );

  return <GestureContext.Provider value={value}>{children}</GestureContext.Provider>;
}

export function useGestureContext() {
  const context = useContext(GestureContext);

  if (!context) {
    throw new Error('useGestureContext must be used inside GestureProvider');
  }

  return context;
}
