import type {
  ForestChapterId,
  ForestStoryEventId,
  ForestStoryFlag,
} from '../types';

export type ForestDemoSnapshot = {
  activeChapterId: ForestChapterId;
  completedFlags: ForestStoryFlag[];
  triggeredEventIds: ForestStoryEventId[];
  hasStarted: boolean;
};

export const FOREST_DEMO_STORAGE_KEY = 'otter-planet:forest-demo-state';

export const createDefaultForestDemoSnapshot = (): ForestDemoSnapshot => ({
  activeChapterId: 'moon-missing',
  completedFlags: [],
  triggeredEventIds: [],
  hasStarted: false,
});

export function readForestDemoSnapshot(): ForestDemoSnapshot {
  if (typeof window === 'undefined') {
    return createDefaultForestDemoSnapshot();
  }

  const rawValue = window.localStorage.getItem(FOREST_DEMO_STORAGE_KEY);

  if (!rawValue) {
    return createDefaultForestDemoSnapshot();
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<ForestDemoSnapshot>;

    return {
      activeChapterId:
        parsedValue.activeChapterId ?? createDefaultForestDemoSnapshot().activeChapterId,
      completedFlags: parsedValue.completedFlags ?? [],
      triggeredEventIds: parsedValue.triggeredEventIds ?? [],
      hasStarted: parsedValue.hasStarted ?? false,
    };
  } catch {
    return createDefaultForestDemoSnapshot();
  }
}

export function writeForestDemoSnapshot(snapshot: ForestDemoSnapshot) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(FOREST_DEMO_STORAGE_KEY, JSON.stringify(snapshot));
}
