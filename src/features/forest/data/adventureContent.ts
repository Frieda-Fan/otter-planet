import { forestNpcImageAssets } from '../assets';
import type {
  ForestNpcProfile,
  ForestStoryEventCatalogItem,
  ForestStoryPresentation,
} from '../types';

export const forestNpcProfiles: ForestNpcProfile[] = [
  {
    name: '闪闪',
    role: '领路星精灵',
    description: '总能最先看见会发光的路，会带着你在森林入口找到正确方向。',
    mood: '兴奋',
    imageSrc: forestNpcImageAssets.shanshan,
  },
  {
    name: '小贝壳',
    role: '温柔倾听者',
    description: '会认真听孩子描述路上看到的一切，再把它们变成新的线索。',
    mood: '安静',
    imageSrc: forestNpcImageAssets.xiaobeike,
  },
  {
    name: '猕猴桃先生',
    role: '记忆收藏家',
    description: '擅长把一路上的发现串成故事，也最会分辨真假月亮。',
    mood: '沉稳',
    imageSrc: forestNpcImageAssets.mrKiwi,
  },
  {
    name: '狮子先生',
    role: '月亮守门人',
    description: '会邀请你说出心里的月亮，让森林用最亮的光回应你的想象。',
    mood: '庄重',
    imageSrc: forestNpcImageAssets.lionGuardian,
  },
];

export const forestStoryEventCatalog: ForestStoryEventCatalogItem[] = [
  {
    id: 'scene-light-path',
    title: '点亮出发小路',
    description: '让脚下的发光道路亮起来，正式走进倒悬森林。',
    source: 'scene',
  },
  {
    id: 'story-meet-shanshan',
    title: '听闪闪带路',
    description: '认识第一位森林伙伴，听它告诉你月亮飞往了哪里。',
    source: 'story',
  },
  {
    id: 'voice-describe-forest',
    title: '说说你看见的森林',
    description: '把树冠、月瀑、星光和晶体说出来，森林会记住这些发现。',
    source: 'voice',
  },
  {
    id: 'gesture-point-forward',
    title: '朝前方继续走',
    description: '做出继续前进的动作，让小水獭知道你已经准备好了。',
    source: 'gesture',
  },
  {
    id: 'scene-crystal-response',
    title: '靠近漂浮晶体',
    description: '当你靠近道路边的发光物，森林会给出新的回应。',
    source: 'scene',
  },
  {
    id: 'story-review-clues',
    title: '回想一路线索',
    description: '把看见和听见的东西连起来，猜猜前方那轮月亮是不是假的。',
    source: 'story',
  },
  {
    id: 'scene-fake-moon-break',
    title: '走近奇怪的月亮',
    description: '勇敢靠近一点，看看它为什么和你心里的想象并不一样。',
    source: 'scene',
  },
  {
    id: 'gesture-lift-wand',
    title: '举起星光魔法棒',
    description: '做出施法动作，把散开的星光重新聚拢起来。',
    source: 'gesture',
  },
  {
    id: 'voice-describe-true-moon',
    title: '说出心里的月亮',
    description: '告诉森林，你最想看见一轮什么样的月亮。',
    source: 'voice',
  },
  {
    id: 'story-final-blessing',
    title: '收下森林祝福',
    description: '让故事落到最温柔的结尾，然后带着结果去分享。',
    source: 'story',
  },
];

export const forestStoryPresentations: ForestStoryPresentation[] = [
  {
    id: 'moon-missing',
    label: '第一站',
    title: '月亮不见了',
    summary: '入口的道路还很安静，只有树冠和风在上方轻轻摇晃，像在等你们出发。',
    objective: '跟着闪闪点亮第一段道路，找到月亮留下的第一条线索。',
    season: '暮色刚降临',
    mode: '出发',
    npc: forestNpcProfiles[0],
    sceneEvent: '倒悬树冠缓缓出现，入口的小路刚刚被月光唤醒。',
    dialogue: [
      {
        speaker: '旁白',
        text: '今晚的森林有点不一样，原本挂在树梢上的月亮，忽然不见了。',
      },
      {
        speaker: '水獭',
        text: '别担心，我会一直陪着你。我们先把这条路点亮，好吗？',
      },
      {
        speaker: 'NPC',
        text: '我是闪闪，我看见月亮的光往森林更深处飞去了。快跟我来。',
      },
    ],
  },
  {
    id: 'glow-trail',
    label: '第二站',
    title: '沿着发光道路前进',
    summary: '道路越走越长，浮石开始飘起来，头顶的树冠和前方的月瀑也慢慢靠近了。',
    objective: '一边往前走，一边告诉小贝壳你在这段路上看见了什么。',
    season: '月雾升起来了',
    mode: '探索',
    npc: forestNpcProfiles[1],
    sceneEvent: '发光道路被完全铺开，漂浮的石块和晶体开始在你身边轻轻回应。',
    dialogue: [
      {
        speaker: '旁白',
        text: '你们正沿着会发光的道路慢慢往前走，眼前的森林像故事一样展开。',
      },
      {
        speaker: 'NPC',
        text: '我是小贝壳，把你看见的树、石头、月瀑和星光都告诉我吧。',
      },
      {
        speaker: '水獭',
        text: '你每说出一个发现，这段路就会变得更亮一点。',
      },
    ],
  },
  {
    id: 'fake-moon',
    label: '第三站',
    title: '那轮月亮不太对',
    summary: '前方真的出现了一轮月亮，可浮石和树影都像在悄悄提醒你，它并不是真的。',
    objective: '回想一路上的线索，找出眼前这轮月亮不对劲的地方。',
    season: '夜色最深的时候',
    mode: '分辨',
    npc: forestNpcProfiles[2],
    sceneEvent: '道路尽头的光忽然碎成星群，浮石在两侧缓慢旋转，像是在提示反转。',
    dialogue: [
      {
        speaker: 'NPC',
        text: '我是猕猴桃先生，真正的月亮不会这么安静。你愿意再仔细看看吗？',
      },
      {
        speaker: '旁白',
        text: '原来那只是一轮被星光包起来的假月亮，真正的答案还在更远的地方。',
      },
      {
        speaker: '水獭',
        text: '没关系，我们已经比刚才更接近真正的月亮了。',
      },
    ],
  },
  {
    id: 'true-moon',
    label: '第四站',
    title: '真正的月亮醒来了',
    summary: '前方的道路终于通向尽头。月光、树冠和浮石一起安静下来，像在等你说出最后的愿望。',
    objective: '说出你心里那轮最特别的月亮，收下今晚的森林礼物。',
    season: '月辉回来了',
    mode: '收获',
    npc: forestNpcProfiles[3],
    sceneEvent: '发光道路通向最亮的地方，整片森林在为你真正的月亮让路。',
    dialogue: [
      {
        speaker: 'NPC',
        text: '我是狮子先生，把你最想看到的月亮告诉我吧，森林会认真听见。',
      },
      {
        speaker: '水獭',
        text: '你说得越认真，这轮月亮就会越像你心里的样子。',
      },
      {
        speaker: '旁白',
        text: '当最后一句话落下，真正的月亮轻轻亮了起来，整座森林都在为你欢呼。',
      },
    ],
  },
];
