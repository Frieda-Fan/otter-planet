export type SceneInteraction =
  | 'light_path'
  | 'crystal_response'
  | 'fake_moon_break';

export type SceneSignal = {
  kind: 'interaction_completed';
  interaction: SceneInteraction;
};

export function createSceneSignal(interaction: SceneInteraction): SceneSignal {
  return {
    kind: 'interaction_completed',
    interaction,
  };
}
