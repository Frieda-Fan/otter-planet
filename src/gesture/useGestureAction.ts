import { useEffect } from 'react';
import { useGestureContext } from './GestureProvider';
import type { GestureResult } from './gestureTypes';

export function useGestureAction(callback: (gesture: GestureResult) => void) {
  const { currentGesture } = useGestureContext();

  useEffect(() => {
    if (currentGesture.name !== 'idle') {
      callback(currentGesture);
    }
  }, [callback, currentGesture]);
}
