import type { GestureSignal } from '../../../systems/gesture';
import { createStoryEventBridge } from '../../../systems/story';
import type { SceneSignal } from '../../../systems/scene';
import type { VoiceSignal } from '../../../systems/voice';
import type {
  ForestStoryDispatchEvent,
  ForestStoryEventCatalogItem,
  ForestStoryEventSource,
} from '../types';

type ForestBridgePayload =
  | { type: 'manual'; event: ForestStoryDispatchEvent }
  | { type: 'voice'; signal: VoiceSignal }
  | { type: 'scene'; signal: SceneSignal }
  | { type: 'gesture'; signal: GestureSignal }
  | { type: 'story'; event: ForestStoryDispatchEvent };

function resolveVoiceEvent(signal: VoiceSignal): ForestStoryDispatchEvent | null {
  if (signal.intent === 'describe_forest') {
    return {
      eventId: 'voice-describe-forest',
      source: 'voice',
    };
  }

  if (signal.intent === 'describe_true_moon') {
    return {
      eventId: 'voice-describe-true-moon',
      source: 'voice',
    };
  }

  return null;
}

function resolveSceneEvent(signal: SceneSignal): ForestStoryDispatchEvent | null {
  if (signal.interaction === 'light_path') {
    return {
      eventId: 'scene-light-path',
      source: 'scene',
    };
  }

  if (signal.interaction === 'crystal_response') {
    return {
      eventId: 'scene-crystal-response',
      source: 'scene',
    };
  }

  if (signal.interaction === 'fake_moon_break') {
    return {
      eventId: 'scene-fake-moon-break',
      source: 'scene',
    };
  }

  return null;
}

function resolveGestureEvent(
  signal: GestureSignal,
): ForestStoryDispatchEvent | null {
  if (signal.checkpoint === 'point_forward') {
    return {
      eventId: 'gesture-point-forward',
      source: 'gesture',
    };
  }

  if (signal.checkpoint === 'lift_wand') {
    return {
      eventId: 'gesture-lift-wand',
      source: 'gesture',
    };
  }

  return null;
}

function resolveForestBridgeEvent(
  source: ForestStoryEventSource,
  payload: ForestBridgePayload,
): ForestStoryDispatchEvent | null {
  if (payload.type === 'manual' && source === 'story') {
    return payload.event;
  }

  if (payload.type === 'story' && source === 'story') {
    return payload.event;
  }

  if (payload.type === 'voice' && source === 'voice') {
    return resolveVoiceEvent(payload.signal);
  }

  if (payload.type === 'scene' && source === 'scene') {
    return resolveSceneEvent(payload.signal);
  }

  if (payload.type === 'gesture' && source === 'gesture') {
    return resolveGestureEvent(payload.signal);
  }

  return null;
}

export function createForestStoryEventBridge(
  dispatchEvent: (event: ForestStoryDispatchEvent) => void,
) {
  const bridge = createStoryEventBridge<
    ForestStoryDispatchEvent,
    ForestStoryEventSource,
    ForestBridgePayload
  >({
    dispatchEvent,
    resolveEvent: resolveForestBridgeEvent,
  });

  return {
    emitManualEvent(event: ForestStoryEventCatalogItem) {
      return bridge.emit(event.source, {
        type: event.source === 'story' ? 'story' : 'manual',
        event: {
          eventId: event.id,
          source: event.source,
        },
      });
    },
    emitVoiceSignal(signal: VoiceSignal) {
      return bridge.emit('voice', {
        type: 'voice',
        signal,
      });
    },
    emitSceneSignal(signal: SceneSignal) {
      return bridge.emit('scene', {
        type: 'scene',
        signal,
      });
    },
    emitGestureSignal(signal: GestureSignal) {
      return bridge.emit('gesture', {
        type: 'gesture',
        signal,
      });
    },
    emitStoryEvent(event: ForestStoryDispatchEvent) {
      return bridge.emit('story', {
        type: 'story',
        event,
      });
    },
  };
}
