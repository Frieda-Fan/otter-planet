export type StoryNodeDefinitionBase<
  TId extends string,
  TFlag extends string,
  TEventId extends string,
> = {
  id: TId;
  entryFlags: TFlag[];
  completionFlag: TFlag;
  unlockFlags: TFlag[];
  eventIds: TEventId[];
};

export type StoryEventCatalogItemBase<
  TEventId extends string,
  TSource extends string,
> = {
  id: TEventId;
  source: TSource;
};

export type StoryDispatchEvent<TEventId extends string, TSource extends string> = {
  eventId: TEventId;
  source: TSource;
};

export function getStoryNodeById<
  TNode extends StoryNodeDefinitionBase<string, string, string>,
>(nodes: TNode[], currentId: TNode['id']) {
  const node = nodes.find((item) => item.id === currentId);

  if (!node) {
    throw new Error(`Story node not found: ${currentId}`);
  }

  return node;
}

export function getStoryEventById<
  TEvent extends StoryEventCatalogItemBase<string, string>,
>(events: TEvent[], eventId: TEvent['id']) {
  const event = events.find((item) => item.id === eventId);

  if (!event) {
    throw new Error(`Story event not found: ${eventId}`);
  }

  return event;
}

export function isStoryNodeUnlocked<
  TNode extends StoryNodeDefinitionBase<string, string, string>,
>(node: TNode, flags: Set<TNode['completionFlag']>) {
  return node.entryFlags.every((flag) => flags.has(flag));
}

export function isStoryNodeCompleted<
  TNode extends StoryNodeDefinitionBase<string, string, string>,
>(node: TNode, flags: Set<TNode['completionFlag']>) {
  return flags.has(node.completionFlag);
}

export function getStoryNodeEventProgress<
  TNode extends StoryNodeDefinitionBase<string, string, string>,
>(node: TNode, triggeredEventIds: Set<TNode['eventIds'][number]>) {
  const completedEventCount = node.eventIds.filter((eventId) =>
    triggeredEventIds.has(eventId),
  ).length;

  return {
    completedEventCount,
    totalEventCount: node.eventIds.length,
    canComplete: completedEventCount === node.eventIds.length,
  };
}

export function getNextUnlockedStoryNodeId<
  TNode extends StoryNodeDefinitionBase<string, string, string>,
>(nodes: TNode[], currentId: TNode['id'], flags: Set<TNode['completionFlag']>): TNode['id'] | null {
  const currentIndex = nodes.findIndex((node) => node.id === currentId);

  if (currentIndex < 0) {
    return null;
  }

  for (let index = currentIndex + 1; index < nodes.length; index += 1) {
    if (isStoryNodeUnlocked(nodes[index], flags)) {
      return nodes[index].id;
    }
  }

  return null;
}

export function createStoryEventDispatcher<
  TNode extends StoryNodeDefinitionBase<string, string, string>,
  TEvent extends StoryEventCatalogItemBase<TNode['eventIds'][number], string>,
>(config: {
  eventCatalog: TEvent[];
  getActiveNode: () => TNode;
  getCompletedFlags: () => Set<TNode['completionFlag']>;
  getTriggeredEventIds: () => Set<TNode['eventIds'][number]>;
  onDispatchAccepted: (event: StoryDispatchEvent<TEvent['id'], TEvent['source']>) => void;
}) {
  return {
    dispatch(event: StoryDispatchEvent<TEvent['id'], TEvent['source']>) {
      const activeNode = config.getActiveNode();
      const catalogEvent = getStoryEventById(config.eventCatalog, event.eventId);
      const completedFlags = config.getCompletedFlags();
      const triggeredEventIds = config.getTriggeredEventIds();

      if (isStoryNodeCompleted(activeNode, completedFlags)) {
        return { accepted: false, reason: 'node-completed' as const };
      }

      if (!activeNode.eventIds.includes(event.eventId)) {
        return { accepted: false, reason: 'event-not-in-active-node' as const };
      }

      if (catalogEvent.source !== event.source) {
        return { accepted: false, reason: 'event-source-mismatch' as const };
      }

      if (triggeredEventIds.has(event.eventId)) {
        return { accepted: false, reason: 'event-already-triggered' as const };
      }

      config.onDispatchAccepted(event);

      return { accepted: true, reason: 'accepted' as const };
    },
  };
}

export function createStoryEventBridge<
  TDispatchEvent extends { eventId: string; source: string },
  TSource extends TDispatchEvent['source'],
  TPayload,
>(config: {
  dispatchEvent: (event: TDispatchEvent) => void;
  resolveEvent: (source: TSource, payload: TPayload) => TDispatchEvent | null;
}) {
  return {
    emit(source: TSource, payload: TPayload) {
      const resolvedEvent = config.resolveEvent(source, payload);

      if (!resolvedEvent) {
        return { accepted: false, reason: 'no-matching-event' as const };
      }

      config.dispatchEvent(resolvedEvent);

      return { accepted: true, reason: 'accepted' as const };
    },
  };
}
