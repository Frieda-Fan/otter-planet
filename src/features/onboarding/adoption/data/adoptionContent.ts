import type { RitualStep } from '../../../../types';
import type { OtterPersonalityTag } from '../../../../state';

export const adoptionTraits: Array<{
  tag: OtterPersonalityTag;
  description: string;
}> = [
  {
    tag: '勇敢',
    description: '遇到黑夜和未知时，会第一时间站出来陪你往前走。',
  },
  {
    tag: '温柔',
    description: '说话轻轻的，会在你紧张时给你最暖的回应。',
  },
  {
    tag: '好奇',
    description: '总会发现森林里最亮、最奇妙的小线索。',
  },
  {
    tag: '俏皮',
    description: '爱逗你笑，也会把冒险路上每一步变得更有趣。',
  },
];

export const ritualSteps: RitualStep[] = [
  {
    title: '1. 认识新伙伴',
    description: '先给小水獭一个名字，让它知道今晚要陪谁一起去森林。',
  },
  {
    title: '2. 选出它的性格',
    description: '选中一种或两种性格以后，它就会带着这些气质陪你一起前进。',
  },
  {
    title: '3. 一起走进森林',
    description: '准备好了以后，就能带着新伙伴正式开始寻找月亮。',
  },
];
