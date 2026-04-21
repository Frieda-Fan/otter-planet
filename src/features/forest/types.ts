export type ForestAdventureMode = {
  title: string;
  description: string;
};

export type ForestNpcProfile = {
  name: string;
  role: string;
  description: string;
  mood: string;
};

export type ForestDialogueTurn = {
  speaker: '旁白' | '水獭' | 'NPC';
  text: string;
};

export type ForestChapterId =
  | 'moon-missing'
  | 'glow-trail'
  | 'fake-moon'
  | 'true-moon';

export type ForestStoryFlag =
  | 'story-intro-opened'
  | 'story-first-clue-found'
  | 'story-expression-recorded'
  | 'story-fake-moon-exposed'
  | 'story-true-moon-created';

export type ForestStoryEventId =
  | 'scene-light-path'
  | 'story-meet-shanshan'
  | 'gesture-point-forward'
  | 'voice-describe-forest'
  | 'scene-crystal-response'
  | 'story-review-clues'
  | 'gesture-lift-wand'
  | 'scene-fake-moon-break'
  | 'voice-describe-true-moon'
  | 'story-final-blessing';

export type ForestStoryEventSource = 'story' | 'scene' | 'voice' | 'gesture';

export type ForestStoryEventCatalogItem = {
  id: ForestStoryEventId;
  title: string;
  description: string;
  source: ForestStoryEventSource;
};

export type ForestStoryReward = {
  stars: number;
  moonlight: number;
  badge: string;
};

export type ForestStoryNodeDefinition = {
  id: ForestChapterId;
  entryFlags: ForestStoryFlag[];
  completionFlag: ForestStoryFlag;
  unlockFlags: ForestStoryFlag[];
  eventIds: ForestStoryEventId[];
  reward: ForestStoryReward;
};

export type ForestStoryPresentation = {
  id: ForestChapterId;
  label: string;
  title: string;
  summary: string;
  objective: string;
  season: string;
  mode: ForestAdventureMode['title'];
  npc: ForestNpcProfile;
  sceneEvent: string;
  dialogue: ForestDialogueTurn[];
};

export type ForestStoryDispatchEvent = {
  eventId: ForestStoryEventId;
  source: ForestStoryEventSource;
};

export type ForestResolvedStoryNode = ForestStoryNodeDefinition &
  ForestStoryPresentation & {
    isActive: boolean;
    isUnlocked: boolean;
    isCompleted: boolean;
    canComplete: boolean;
    completedEventCount: number;
    totalEventCount: number;
    events: ForestStoryEventCatalogItem[];
  };
