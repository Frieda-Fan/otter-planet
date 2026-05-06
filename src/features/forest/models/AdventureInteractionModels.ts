import type {
  ForestResolvedStoryNode,
  ForestRouteSceneStage,
  ForestStoryEventCatalogItem,
} from '../types';

const sourceLabelMap = {
  story: '听听故事',
  scene: '观察场景',
  voice: '说一说',
  gesture: '做动作',
} as const;

export class RouteActionModel {
  constructor(
    public readonly event: ForestStoryEventCatalogItem,
    private readonly isTriggered: boolean,
    private readonly chapterCompleted: boolean,
  ) {}

  get sourceLabel() {
    return sourceLabelMap[this.event.source];
  }

  get buttonLabel() {
    return this.isTriggered ? '已经完成' : this.event.title;
  }

  get helperText() {
    return `${this.sourceLabel}：${this.event.description}`;
  }

  get disabled() {
    return this.isTriggered || this.chapterCompleted;
  }

  get done() {
    return this.isTriggered;
  }
}

export class NpcInteractionModel {
  constructor(
    private readonly chapter: ForestResolvedStoryNode,
    private readonly currentRouteStage: ForestRouteSceneStage,
    private readonly actionModels: RouteActionModel[],
  ) {}

  get npc() {
    return this.chapter.npc;
  }

  get currentDialogue() {
    return this.chapter.dialogue[
      Math.min(
        this.actionModels.filter((action) => action.done).length,
        this.chapter.dialogue.length - 1,
      )
    ];
  }

  get headline() {
    return `${this.npc.name}正在陪你走过${this.currentRouteStage.title}`;
  }

  get prompt() {
    const nextPendingAction = this.actionModels.find((action) => !action.done);

    if (!nextPendingAction) {
      return '这一段路已经准备好了，继续往前就能进入新的森林场景。';
    }

    return `${nextPendingAction.sourceLabel}之后，${this.npc.name} 会继续给你新的线索。`;
  }

  get atmosphereNote() {
    return this.currentRouteStage.atmosphere;
  }
}
