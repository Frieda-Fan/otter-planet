export type GestureCheckpoint = 'point_forward' | 'open_palm' | 'lift_wand';

export type GestureSignal = {
  kind: 'checkpoint_detected';
  checkpoint: GestureCheckpoint;
};

export function createGestureSignal(
  checkpoint: GestureCheckpoint,
): GestureSignal {
  return {
    kind: 'checkpoint_detected',
    checkpoint,
  };
}
