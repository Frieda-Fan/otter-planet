import type { RouteCard } from '../../../../types';

export const landingHighlights = [
  {
    title: '童话级沉浸开场',
    description: '倒悬森林、月光丝带与柔和发光晶体，建立奇幻但安全的第一感受。',
  },
  {
    title: '语音 + 手势双交互',
    description: '围绕魔法棒体验设计，让孩子尽量不用键盘和复杂点击也能继续冒险。',
  },
  {
    title: '剧情闭环可分享',
    description: '从找月亮到故事视频生成，最终沉淀为作品库与家长可传播内容。',
  },
];

export const routeCards: RouteCard[] = [
  {
    eyebrow: 'Launch',
    title: '启动落地页',
    description: '产品世界观、主视觉和核心体验价值展示。',
    to: '/',
    cta: '查看开场',
  },
  {
    eyebrow: 'Access',
    title: '登录与权限引导',
    description: '面向家长的低门槛入口，兼顾合规说明与权限授权。',
    to: '/login',
    cta: '进入登录',
  },
  {
    eyebrow: 'Bond',
    title: '伙伴领养页',
    description: '建立情感连接，准备进入训练与冒险链路。',
    to: '/adopt',
    cta: '领养水獭',
  },
  {
    eyebrow: 'Scene',
    title: '森林冒险容器',
    description: '后续剧情、交互 HUD、场景探索与 NPC 调度都会从这里扩展。',
    to: '/adventure',
    cta: '查看冒险',
  },
];
