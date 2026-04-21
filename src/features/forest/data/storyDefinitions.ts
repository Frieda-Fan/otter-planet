import type { ForestStoryNodeDefinition } from '../types';

export const forestStoryDefinitions: ForestStoryNodeDefinition[] = [
  {
    id: 'moon-missing',
    entryFlags: [],
    completionFlag: 'story-intro-opened',
    unlockFlags: ['story-first-clue-found'],
    eventIds: ['scene-light-path', 'story-meet-shanshan', 'gesture-point-forward'],
    reward: {
      stars: 120,
      moonlight: 68,
      badge: '第一枚月光碎片',
    },
  },
  {
    id: 'glow-trail',
    entryFlags: ['story-first-clue-found'],
    completionFlag: 'story-expression-recorded',
    unlockFlags: ['story-expression-recorded'],
    eventIds: ['voice-describe-forest', 'scene-crystal-response'],
    reward: {
      stars: 260,
      moonlight: 74,
      badge: '第二枚月光碎片',
    },
  },
  {
    id: 'fake-moon',
    entryFlags: ['story-expression-recorded'],
    completionFlag: 'story-fake-moon-exposed',
    unlockFlags: ['story-fake-moon-exposed'],
    eventIds: ['story-review-clues', 'scene-fake-moon-break', 'gesture-lift-wand'],
    reward: {
      stars: 410,
      moonlight: 82,
      badge: '星群反转记忆卡',
    },
  },
  {
    id: 'true-moon',
    entryFlags: ['story-fake-moon-exposed'],
    completionFlag: 'story-true-moon-created',
    unlockFlags: ['story-true-moon-created'],
    eventIds: ['voice-describe-true-moon', 'story-final-blessing'],
    reward: {
      stars: 560,
      moonlight: 100,
      badge: '真月亮揭晓',
    },
  },
];
