import type { RouteCard } from '../../../../types';

export const landingHighlights = [
  {
    title: '像童话一样的夜晚森林',
    description: '会发光的道路、倒悬的树冠和温柔的月瀑，会带孩子慢慢走进故事里。',
  },
  {
    title: '孩子一看就会玩的互动',
    description: '先用点击、输入和选择来完成旅程，后面再慢慢接入语音和手势。',
  },
  {
    title: '每次冒险都能留下回忆',
    description: '从出发、寻找月亮到故事回顾，孩子和家长都能看到这趟旅程的收获。',
  },
];

export const routeCards: RouteCard[] = [
  {
    eyebrow: '今晚可以做什么',
    title: '和小水獭一起开始旅程',
    description: '先认识你的新伙伴，再带着它走进会发光的倒悬森林。',
    to: '/login',
    cta: '现在出发',
  },
  {
    eyebrow: '继续冒险',
    title: '回到上次的月亮任务',
    description: '如果已经领养好小水獭，就能直接继续上次的森林旅程。',
    to: '/adventure',
    cta: '继续寻找月亮',
  },
];
