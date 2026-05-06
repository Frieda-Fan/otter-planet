import type {
  ForestChapterId,
  ForestResolvedStoryNode,
  ForestRouteSceneStage,
} from '../types';

type ChapterBackdropState = {
  sceneClassName: string;
  distanceLabel: string;
  encounterLabel: string;
};

const chapterBackdropStates: Record<ForestChapterId, ChapterBackdropState> = {
  'moon-missing': {
    sceneClassName: 'forest-canvas--chapter-1',
    distanceLabel: '刚刚踏进入口',
    encounterLabel: '遇见第一位领路朋友',
  },
  'glow-trail': {
    sceneClassName: 'forest-canvas--chapter-2',
    distanceLabel: '已经走进森林深处',
    encounterLabel: '在路上遇见温柔倾听者',
  },
  'fake-moon': {
    sceneClassName: 'forest-canvas--chapter-3',
    distanceLabel: '来到了真假月亮交界处',
    encounterLabel: '遇见记忆收藏家',
  },
  'true-moon': {
    sceneClassName: 'forest-canvas--chapter-4',
    distanceLabel: '快走到道路尽头了',
    encounterLabel: '遇见月亮守门人',
  },
};

export class AdventureRouteStageModel {
  constructor(
    public readonly stage: ForestRouteSceneStage,
    public readonly index: number,
    private readonly completedEventCount: number,
    private readonly currentIndex: number,
  ) {}

  get isCurrent() {
    return this.index === this.currentIndex;
  }

  get isDone() {
    return this.index < this.completedEventCount;
  }
}

export class AdventureSceneModel {
  constructor(
    private readonly chapter: ForestResolvedStoryNode,
    private readonly routeStages: ForestRouteSceneStage[],
    private readonly completedEventCount: number,
    private readonly activeChapterIndex: number,
    private readonly totalChapterCount: number,
  ) {}

  get backdrop() {
    return chapterBackdropStates[this.chapter.id];
  }

  get progressPercent() {
    return `${((this.activeChapterIndex + 1) / this.totalChapterCount) * 100}%`;
  }

  get statusLabel() {
    if (this.chapter.isCompleted) {
      return '这一站完成了';
    }

    if (this.chapter.canComplete) {
      return '可以进入下一站';
    }

    if (this.chapter.isUnlocked) {
      return '正在前进中';
    }

    return '旅程还没走到这里';
  }

  get currentRouteIndex() {
    return Math.min(this.completedEventCount, this.routeStages.length - 1);
  }

  get currentRouteStage() {
    return this.routeStages[this.currentRouteIndex];
  }

  get routeNodes() {
    return this.routeStages.map(
      (stage, index) =>
        new AdventureRouteStageModel(
          stage,
          index,
          this.completedEventCount,
          this.currentRouteIndex,
        ),
    );
  }
}
