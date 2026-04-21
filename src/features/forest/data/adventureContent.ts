import type {
  ForestAdventureMode,
  ForestNpcProfile,
  ForestStoryEventCatalogItem,
  ForestStoryPresentation,
} from '../types';

export const forestAdventureModes: ForestAdventureMode[] = [
  {
    title: '剧情模式',
    description: '围绕“消失的月亮”推进节点，控制旁白、NPC、奖励与镜头变化。',
  },
  {
    title: '探索模式',
    description: '采用第一人称沿路前进的镜头语言，让水獭陪着孩子穿梭倒悬森林、月瀑与发光晶体之间。',
  },
  {
    title: '结算模式',
    description: '进入故事复述、剧照串联与专属月亮展示，承接最终视频生成。',
  },
];

export const forestLayers = [
  '天空层：星群、粉雾、漂浮发光颗粒与远处月瀑的高空光感',
  '树冠层：倒悬树根、巨树树冠、悬挂晶体与星星灯牌',
  '路径层：第一人称视角中的发光花藤道路，承担前进方向引导',
  '角色层：水獭以陪跑伙伴和交互引导者存在，不抢占主视角中心',
  'HUD 层：章节、星星、目标提示、对话框',
];

export const forestExplorationViewpoints = [
  '镜头视角：探索模式改为人视角向前推进，而不是站桩式看舞台。',
  '空间语言：森林是倒悬的，树冠在上、路径向远方延伸，形成穿梭感。',
  '前进线索：发光花藤道路、月瀑和星星灯牌共同构成连续导航。',
  '陪伴方式：水獭从主画面中心退到陪跑提示位，保留陪伴感但不破坏视角。',
];

export const forestSceneAssetCards = [
  {
    name: 'forest-exploration-first-person-inverted-canopy.png',
    type: '主背景',
    description: '探索模式第一人称主背景，表现倒悬森林、月光瀑布和发光前进道路。',
  },
  {
    name: 'forest-glow-star.svg',
    type: '特效素材',
    description: '用于场景中的发光星星路标、交互提示点和导航装饰。',
  },
  {
    name: 'forest-waterfall-column.svg',
    type: '特效素材',
    description: '用于页面里的月瀑光柱占位和后续 scene 系统接入前的视觉增强。',
  },
  {
    name: 'forest-floating-crystal.svg',
    type: '道具素材',
    description: '用于悬挂晶体、漂浮晶体或晶体奖励点的前端占位。',
  },
  {
    name: 'forest-path-ribbon.svg',
    type: '路径素材',
    description: '用于强调探索模式中道路的丝带发光轨迹和镜头方向感。',
  },
];

export const forestNpcProfiles: ForestNpcProfile[] = [
  {
    name: '闪闪',
    role: '第一位小伙伴',
    description: '负责救援与定向表达，帮助孩子快速进入“我为什么要找月亮”的主题。',
    mood: '兴奋',
  },
  {
    name: '小贝壳',
    role: '开放表达触发者',
    description: '承接共情鼓励，让孩子说出真实想法，为后续故事生成留素材。',
    mood: '温柔',
  },
  {
    name: '猕猴桃先生',
    role: '故事收束核心角色',
    description: '负责两次复述检查和剧情回顾，是叙事逻辑训练的关键枢纽。',
    mood: '沉稳',
  },
  {
    name: '狮子',
    role: '终章守门人',
    description: '引导孩子描述自己想象中的月亮，并把真月亮作为高潮回报给用户。',
    mood: '庄重',
  },
];

export const forestStoryEventCatalog: ForestStoryEventCatalogItem[] = [
  {
    id: 'scene-light-path',
    title: '点亮发光藤路',
    description: '模拟 `scene` 层点亮入口路径，让孩子知道可以开始前进。',
    source: 'scene',
  },
  {
    id: 'story-meet-shanshan',
    title: '闪闪正式出场',
    description: '模拟 `story` 层触发第一个 NPC 出场和开场对白。',
    source: 'story',
  },
  {
    id: 'voice-describe-forest',
    title: '记录森林描述',
    description: '模拟 `voice` 层收集孩子对第一人称探索视角里看到的森林、月瀑和星灯描述。',
    source: 'voice',
  },
  {
    id: 'gesture-point-forward',
    title: '手势指向前方',
    description: '模拟 `gesture` 层检测到“向前指路”动作，确认孩子准备继续探索。',
    source: 'gesture',
  },
  {
    id: 'scene-crystal-response',
    title: '触发晶体反馈',
    description: '模拟 `scene` 层让沿路晶体、漂浮石块和发光路标对靠近行为做出反馈。',
    source: 'scene',
  },
  {
    id: 'story-review-clues',
    title: '回顾一路线索',
    description: '模拟 `story` 层进行一次剧情复盘和情绪安抚。',
    source: 'story',
  },
  {
    id: 'scene-fake-moon-break',
    title: '假月亮碎裂',
    description: '模拟 `scene` 层触发反转事件和星群散开效果。',
    source: 'scene',
  },
  {
    id: 'gesture-lift-wand',
    title: '抬起魔法棒',
    description: '模拟 `gesture` 层检测到抬手/举棒动作，推动反转场景进入下一步。',
    source: 'gesture',
  },
  {
    id: 'voice-describe-true-moon',
    title: '描述真月亮',
    description: '模拟 `voice` 层收集孩子对最终月亮形象的描述。',
    source: 'voice',
  },
  {
    id: 'story-final-blessing',
    title: '完成终章祝福',
    description: '模拟 `story` 层收束剧情，并准备接分享与视频结果页。',
    source: 'story',
  },
];

export const forestStoryPresentations: ForestStoryPresentation[] = [
  {
    id: 'moon-missing',
    label: '第一章',
    title: '消失的月亮',
    summary: '月亮失踪，森林从黄昏转入夜色，孩子和水獭正式出发。',
    objective: '沿着发光藤路前进，先找到月亮留下的第一条线索。',
    season: '暮春夜',
    mode: '剧情模式',
    npc: forestNpcProfiles[0],
    sceneEvent: '月光瀑布被点亮，入口区域出现第一条会发光的道路。',
    dialogue: [
      {
        speaker: '旁白',
        text: '今晚的森林有点不一样，月亮忽然不见了，只剩下一缕发光的痕迹。',
      },
      {
        speaker: '水獭',
        text: '别担心，我们慢慢走，我会一直陪着你。',
      },
      {
        speaker: 'NPC',
        text: '我是闪闪，我看见月光往森林深处飞去了。',
      },
    ],
  },
  {
    id: 'glow-trail',
    label: '第二章',
    title: '发光藤路',
    summary: '镜头切到第一人称后，孩子沿着发光花藤道路深入倒悬森林，边前进边观察环境线索。',
    objective: '沿着月瀑下方的发光道路前进，描述你一路看到的星灯、晶体和倒悬树冠。',
    season: '月雾升起',
    mode: '探索模式',
    npc: forestNpcProfiles[1],
    sceneEvent: '第一人称镜头向前推进，发光道路、漂浮石块、星星灯牌和晶体对靠近行为逐步回应。',
    dialogue: [
      {
        speaker: '旁白',
        text: '你正沿着一条会发光的花藤道路前进，整座倒悬森林像在向你慢慢打开。',
      },
      {
        speaker: 'NPC',
        text: '我是小贝壳，把你一路看到的星灯、瀑布和晶体都说出来，月亮会记住这些描述。',
      },
      {
        speaker: '水獭',
        text: '我会陪着你一直往前跑，你说出来的每一个发现，都会变成前进的线索。',
      },
    ],
  },
  {
    id: 'fake-moon',
    label: '第三章',
    title: '假月亮散开',
    summary: '眼前出现一轮假月亮，但它很快裂成星群，剧情迎来反转。',
    objective: '分辨假月亮的异常，回顾一路上的线索，准备迎接真正答案。',
    season: '夜色最深时',
    mode: '剧情模式',
    npc: forestNpcProfiles[2],
    sceneEvent: '假月亮碎裂成星群，镜头和 HUD 一起切入高张力状态。',
    dialogue: [
      {
        speaker: 'NPC',
        text: '我是猕猴桃先生，这一轮月亮太安静了，它不像真正会回应你的月亮。',
      },
      {
        speaker: '旁白',
        text: '就在你靠近的那一刻，月亮散成了好多好多星星。',
      },
      {
        speaker: '水獭',
        text: '没关系，我们已经知道更多线索了，真正的月亮一定在等我们。',
      },
    ],
  },
  {
    id: 'true-moon',
    label: '第四章',
    title: '真月亮揭晓',
    summary: '孩子描述自己想象中的月亮，森林最终回应出专属的真月亮。',
    objective: '说出你心里的月亮是什么样子，完成最后的故事结算。',
    season: '黎明前的月辉',
    mode: '结算模式',
    npc: forestNpcProfiles[3],
    sceneEvent: '山坡上升起真正的月亮，森林进入奖励与分享前的收束时刻。',
    dialogue: [
      {
        speaker: 'NPC',
        text: '我是狮子，把你想象中的月亮告诉我吧，它会听见你的描述。',
      },
      {
        speaker: '水獭',
        text: '你说得越认真，月亮就会越像你心里想的样子。',
      },
      {
        speaker: '旁白',
        text: '森林轻轻亮了起来，真正的月亮终于回应了这一路的寻找。',
      },
    ],
  },
];
