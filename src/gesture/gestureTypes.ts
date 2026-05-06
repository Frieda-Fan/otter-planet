export type GestureName =
  | 'idle'
  | 'magic_wake'
  | 'swipe_left'
  | 'swipe_right'
  | 'push_forward'
  | 'draw_circle'
  | 'trajectory_spell';

export type GestureResult = {
  name: GestureName;
  confidence: number;
  direction?: 'left' | 'right' | 'forward' | 'circle';
  center?: { x: number; y: number; z: number };
  debug?: string;
};
