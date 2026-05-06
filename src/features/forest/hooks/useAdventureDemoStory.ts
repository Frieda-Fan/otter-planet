import { useEffect, useMemo, useState } from 'react';
import { forestStoryEventCatalog, forestStoryPresentations } from '../data/adventureContent';
import {
  createDefaultForestDemoSnapshot,
  readForestDemoSnapshot,
  writeForestDemoSnapshot,
  type ForestDemoSnapshot,
} from '../utils/demoStorage';
import type {
  ForestResolvedStoryNode,
  ForestStoryEventCatalogItem,
  ForestStoryFlag,
  ForestStoryNodeDefinition,
  ForestStoryReward,
} from '../types';

const forestStoryNodes: ForestStoryNodeDefinition[] = [
  {
    id: 'moon-missing',
    entryFlags: [],
    completionFlag: 'story-intro-opened',
    unlockFlags: [],
    eventIds: ['scene-light-path', 'story-meet-shanshan', 'gesture-point-forward'],
    reward: {
      stars: 120,
      moonlight: 25,
      badge: 'First Glow',
    },
  },
  {
    id: 'glow-trail',
    entryFlags: ['story-intro-opened'],
    completionFlag: 'story-first-clue-found',
    unlockFlags: ['story-intro-opened'],
    eventIds: ['voice-describe-forest', 'scene-crystal-response'],
    reward: {
      stars: 180,
      moonlight: 50,
      badge: 'Forest Listener',
    },
  },
  {
    id: 'fake-moon',
    entryFlags: ['story-first-clue-found'],
    completionFlag: 'story-fake-moon-exposed',
    unlockFlags: ['story-first-clue-found'],
    eventIds: ['story-review-clues', 'scene-fake-moon-break'],
    reward: {
      stars: 240,
      moonlight: 75,
      badge: 'Truth Finder',
    },
  },
  {
    id: 'true-moon',
    entryFlags: ['story-fake-moon-exposed'],
    completionFlag: 'story-true-moon-created',
    unlockFlags: ['story-fake-moon-exposed'],
    eventIds: ['gesture-lift-wand', 'voice-describe-true-moon', 'story-final-blessing'],
    reward: {
      stars: 360,
      moonlight: 100,
      badge: 'Moon Keeper',
    },
  },
];

function getResolvedChapters(snapshot: ForestDemoSnapshot): ForestResolvedStoryNode[] {
  const completedFlags = new Set(snapshot.completedFlags);
  const triggeredEventIds = new Set(snapshot.triggeredEventIds);

  return forestStoryNodes.map((node) => {
    const presentation = forestStoryPresentations.find((item) => item.id === node.id);

    if (!presentation) {
      throw new Error(`Missing story presentation for chapter: ${node.id}`);
    }

    const events = node.eventIds.map((eventId) => {
      const event = forestStoryEventCatalog.find((item) => item.id === eventId);

      if (!event) {
        throw new Error(`Missing event catalog item: ${eventId}`);
      }

      return event;
    });

    const completedEventCount = node.eventIds.filter((eventId) =>
      triggeredEventIds.has(eventId),
    ).length;
    const isCompleted = completedFlags.has(node.completionFlag);
    const isUnlocked = node.entryFlags.every((flag) => completedFlags.has(flag));

    return {
      ...node,
      ...presentation,
      isActive: snapshot.activeChapterId === node.id,
      isUnlocked,
      isCompleted,
      canComplete: completedEventCount === node.eventIds.length,
      completedEventCount,
      totalEventCount: node.eventIds.length,
      events,
    };
  });
}

function getNextChapterId(completedFlags: Set<ForestStoryFlag>, currentId: ForestResolvedStoryNode['id']) {
  const currentIndex = forestStoryNodes.findIndex((node) => node.id === currentId);

  for (let index = currentIndex + 1; index < forestStoryNodes.length; index += 1) {
    const node = forestStoryNodes[index];

    if (node.entryFlags.every((flag) => completedFlags.has(flag))) {
      return node.id;
    }
  }

  return currentId;
}

function getUnlockedActiveChapterId(chapters: ForestResolvedStoryNode[], activeId: ForestResolvedStoryNode['id']) {
  const activeChapter = chapters.find((chapter) => chapter.id === activeId);

  if (activeChapter?.isUnlocked) {
    return activeChapter.id;
  }

  return chapters.find((chapter) => chapter.isUnlocked)?.id ?? chapters[0].id;
}

function sumReward(
  completedFlags: Set<ForestStoryFlag>,
  field: keyof Pick<ForestStoryReward, 'stars' | 'moonlight'>,
) {
  return forestStoryNodes.reduce((total, node) => {
    if (!completedFlags.has(node.completionFlag)) {
      return total;
    }

    return total + node.reward[field];
  }, 0);
}

export function useAdventureDemoStory() {
  const [snapshot, setSnapshot] = useState<ForestDemoSnapshot>(() => readForestDemoSnapshot());

  useEffect(() => {
    writeForestDemoSnapshot(snapshot);
  }, [snapshot]);

  const chapters = useMemo(() => {
    const resolved = getResolvedChapters(snapshot);
    const activeChapterId = getUnlockedActiveChapterId(resolved, snapshot.activeChapterId);

    return resolved.map((chapter) => ({
      ...chapter,
      isActive: chapter.id === activeChapterId,
    }));
  }, [snapshot]);

  const activeChapter =
    chapters.find((chapter) => chapter.isActive) ??
    chapters[0];

  const triggeredEventIds = useMemo(() => new Set(snapshot.triggeredEventIds), [snapshot.triggeredEventIds]);

  const dispatchStoryEvent = (event: ForestStoryEventCatalogItem) => {
    setSnapshot((currentSnapshot) => {
      const currentChapters = getResolvedChapters(currentSnapshot);
      const currentActiveChapterId = getUnlockedActiveChapterId(
        currentChapters,
        currentSnapshot.activeChapterId,
      );
      const currentChapter = currentChapters.find((chapter) => chapter.id === currentActiveChapterId);

      if (!currentChapter || currentChapter.isCompleted) {
        return currentSnapshot;
      }

      if (!currentChapter.eventIds.includes(event.id)) {
        return currentSnapshot;
      }

      if (currentSnapshot.triggeredEventIds.includes(event.id)) {
        return currentSnapshot;
      }

      return {
        ...currentSnapshot,
        hasStarted: true,
        activeChapterId: currentActiveChapterId,
        triggeredEventIds: [...currentSnapshot.triggeredEventIds, event.id],
      };
    });
  };

  const completeCurrentChapter = () => {
    setSnapshot((currentSnapshot) => {
      const currentChapters = getResolvedChapters(currentSnapshot);
      const currentActiveChapterId = getUnlockedActiveChapterId(
        currentChapters,
        currentSnapshot.activeChapterId,
      );
      const currentChapter = currentChapters.find((chapter) => chapter.id === currentActiveChapterId);

      if (!currentChapter || !currentChapter.canComplete || currentChapter.isCompleted) {
        return currentSnapshot;
      }

      const nextCompletedFlags = new Set(currentSnapshot.completedFlags);
      nextCompletedFlags.add(currentChapter.completionFlag);

      return {
        ...currentSnapshot,
        activeChapterId: getNextChapterId(nextCompletedFlags, currentChapter.id),
        completedFlags: [...nextCompletedFlags],
      };
    });
  };

  const startDemo = () => {
    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      hasStarted: true,
    }));
  };

  const resetDemo = () => {
    setSnapshot(createDefaultForestDemoSnapshot());
  };

  const completedFlags = useMemo(() => new Set(snapshot.completedFlags), [snapshot.completedFlags]);
  const totalReward = useMemo(
    () => ({
      stars: sumReward(completedFlags, 'stars'),
      moonlight: Math.min(100, sumReward(completedFlags, 'moonlight')),
    }),
    [completedFlags],
  );

  const isDemoComplete = chapters.every((chapter) => chapter.isCompleted);

  return {
    activeChapter,
    chapters,
    completeCurrentChapter,
    dispatchStoryEvent,
    hasStarted: snapshot.hasStarted,
    isDemoComplete,
    resetDemo,
    startDemo,
    totalReward,
    triggeredEventIds,
  };
}
