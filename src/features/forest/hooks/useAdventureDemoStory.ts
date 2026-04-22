import { useEffect, useMemo, useState } from 'react';
import { createGestureSignal } from '../../../systems/gesture';
import { createSceneSignal } from '../../../systems/scene';
import {
  createStoryEventDispatcher,
  getNextUnlockedStoryNodeId,
  getStoryNodeById,
  getStoryNodeEventProgress,
  isStoryNodeCompleted,
  isStoryNodeUnlocked,
} from '../../../systems/story';
import { createVoiceSignal } from '../../../systems/voice';
import { createForestStoryEventBridge } from '../bridges/storyEventBridge';
import {
  forestStoryEventCatalog,
  forestStoryPresentations,
} from '../data/adventureContent';
import { forestStoryDefinitions } from '../data/storyDefinitions';
import {
  createDefaultForestDemoSnapshot,
  readForestDemoSnapshot,
  writeForestDemoSnapshot,
} from '../utils/demoStorage';
import type {
  ForestChapterId,
  ForestResolvedStoryNode,
  ForestStoryEventCatalogItem,
  ForestStoryEventId,
  ForestStoryFlag,
  ForestStoryNodeDefinition,
  ForestStoryPresentation,
} from '../types';

function createPresentationMap() {
  return new Map<ForestChapterId, ForestStoryPresentation>(
    forestStoryPresentations.map((item) => [item.id, item]),
  );
}

function createEventMap() {
  return new Map<ForestStoryEventId, ForestStoryEventCatalogItem>(
    forestStoryEventCatalog.map((item) => [item.id, item]),
  );
}

function resolveStoryNodes(
  activeChapterId: ForestChapterId,
  completedFlags: Set<ForestStoryFlag>,
  triggeredEventIds: Set<ForestStoryEventId>,
) {
  const presentationMap = createPresentationMap();
  const eventMap = createEventMap();

  return forestStoryDefinitions.map((definition) => {
    const presentation = presentationMap.get(definition.id);

    if (!presentation) {
      throw new Error(`Story presentation not found: ${definition.id}`);
    }

    const progress = getStoryNodeEventProgress(definition, triggeredEventIds);

    return {
      ...definition,
      ...presentation,
      isActive: definition.id === activeChapterId,
      isUnlocked: isStoryNodeUnlocked(definition, completedFlags),
      isCompleted: isStoryNodeCompleted(definition, completedFlags),
      canComplete: progress.canComplete,
      completedEventCount: progress.completedEventCount,
      totalEventCount: progress.totalEventCount,
      events: definition.eventIds.map((eventId) => {
        const event = eventMap.get(eventId);

        if (!event) {
          throw new Error(`Story event missing from catalog: ${eventId}`);
        }

        return event;
      }),
    } satisfies ForestResolvedStoryNode;
  });
}

export function useAdventureDemoStory() {
  const initialSnapshot = readForestDemoSnapshot();

  const [activeChapterId, setActiveChapterId] = useState<ForestChapterId>(
    initialSnapshot.activeChapterId,
  );
  const [completedFlags, setCompletedFlags] = useState<Set<ForestStoryFlag>>(
    () => new Set(initialSnapshot.completedFlags),
  );
  const [triggeredEventIds, setTriggeredEventIds] = useState<Set<ForestStoryEventId>>(
    () => new Set(initialSnapshot.triggeredEventIds),
  );
  const [hasStarted, setHasStarted] = useState(initialSnapshot.hasStarted);

  const chapters = resolveStoryNodes(
    activeChapterId,
    completedFlags,
    triggeredEventIds,
  );
  const activeChapter = getStoryNodeById(chapters, activeChapterId);

  const completedChapterCount = chapters.filter((node) => node.isCompleted).length;
  const unlockedChapterCount = chapters.filter((node) => node.isUnlocked).length;
  const isDemoComplete =
    completedChapterCount === forestStoryDefinitions.length &&
    chapters.every((node) => node.isCompleted);

  useEffect(() => {
    writeForestDemoSnapshot({
      activeChapterId,
      completedFlags: Array.from(completedFlags),
      triggeredEventIds: Array.from(triggeredEventIds),
      hasStarted,
    });
  }, [activeChapterId, completedFlags, triggeredEventIds, hasStarted]);

  const dispatcher = useMemo(
    () =>
      createStoryEventDispatcher<ForestStoryNodeDefinition, ForestStoryEventCatalogItem>({
        eventCatalog: forestStoryEventCatalog,
        getActiveNode: () => getStoryNodeById(forestStoryDefinitions, activeChapterId),
        getCompletedFlags: () => completedFlags,
        getTriggeredEventIds: () => triggeredEventIds,
        onDispatchAccepted: (event) => {
          setTriggeredEventIds((currentIds) => {
            const nextIds = new Set(currentIds);
            nextIds.add(event.eventId);
            return nextIds;
          });
        },
      }),
    [activeChapterId, completedFlags, triggeredEventIds],
  );

  const goToChapter = (chapterId: ForestChapterId) => {
    const targetNode = getStoryNodeById(chapters, chapterId);

    if (targetNode.isUnlocked) {
      setHasStarted(true);
      setActiveChapterId(chapterId);
    }
  };

  const bridge = useMemo(
    () =>
      createForestStoryEventBridge((event) => {
        dispatcher.dispatch(event);
      }),
    [dispatcher],
  );

  const dispatchStoryEvent = (event: ForestStoryEventCatalogItem) => {
    if (event.source === 'voice') {
      if (event.id === 'voice-describe-forest') {
        return bridge.emitVoiceSignal(
          createVoiceSignal('describe_forest', '我看见了会发光的道路、月瀑和倒悬的树。'),
        );
      }

      if (event.id === 'voice-describe-true-moon') {
        return bridge.emitVoiceSignal(
          createVoiceSignal('describe_true_moon', '我想要一轮会发光、会回应我的月亮。'),
        );
      }
    }

    if (event.source === 'scene') {
      if (event.id === 'scene-light-path') {
        return bridge.emitSceneSignal(createSceneSignal('light_path'));
      }

      if (event.id === 'scene-crystal-response') {
        return bridge.emitSceneSignal(createSceneSignal('crystal_response'));
      }

      if (event.id === 'scene-fake-moon-break') {
        return bridge.emitSceneSignal(createSceneSignal('fake_moon_break'));
      }
    }

    if (event.source === 'gesture') {
      if (event.id === 'gesture-point-forward') {
        return bridge.emitGestureSignal(createGestureSignal('point_forward'));
      }

      if (event.id === 'gesture-lift-wand') {
        return bridge.emitGestureSignal(createGestureSignal('lift_wand'));
      }
    }

    return bridge.emitStoryEvent({
      eventId: event.id,
      source: event.source,
    });
  };

  const completeCurrentChapter = () => {
    if (!activeChapter.canComplete || activeChapter.isCompleted) {
      return;
    }

    const nextFlags = new Set(completedFlags);
    nextFlags.add(activeChapter.completionFlag);
    activeChapter.unlockFlags.forEach((flag) => {
      nextFlags.add(flag);
    });

    setCompletedFlags(nextFlags);

    const nextChapterId = getNextUnlockedStoryNodeId(
      forestStoryDefinitions,
      activeChapter.id,
      nextFlags,
    );

    if (nextChapterId) {
      setActiveChapterId(nextChapterId);
    }
  };

  const startDemo = () => {
    setHasStarted(true);
    setActiveChapterId('moon-missing');
  };

  const resetDemo = () => {
    const defaultSnapshot = createDefaultForestDemoSnapshot();

    setActiveChapterId(defaultSnapshot.activeChapterId);
    setCompletedFlags(new Set(defaultSnapshot.completedFlags));
    setTriggeredEventIds(new Set(defaultSnapshot.triggeredEventIds));
    setHasStarted(defaultSnapshot.hasStarted);
  };

  const totalReward = chapters
    .filter((node) => node.isCompleted)
    .reduce(
      (accumulator, node) => ({
        stars: accumulator.stars + node.reward.stars,
        moonlight: Math.max(accumulator.moonlight, node.reward.moonlight),
      }),
      { stars: 0, moonlight: 0 },
    );

  return {
    activeChapter,
    chapters,
    completedChapterCount,
    completedFlags,
    completeCurrentChapter,
    dispatchStoryEvent,
    dispatchVoiceSignal: bridge.emitVoiceSignal,
    dispatchSceneSignal: bridge.emitSceneSignal,
    dispatchGestureSignal: bridge.emitGestureSignal,
    createVoiceSignal,
    createSceneSignal,
    createGestureSignal,
    goToChapter,
    hasStarted,
    isDemoComplete,
    resetDemo,
    startDemo,
    totalReward,
    triggeredEventIds,
    unlockedChapterCount,
  };
}
