export type VoiceIntent = 'describe_forest' | 'describe_true_moon';

export type VoiceSignal = {
  kind: 'transcript_matched';
  intent: VoiceIntent;
  transcript: string;
  confidence: number;
};

export function createVoiceSignal(
  intent: VoiceIntent,
  transcript: string,
  confidence = 1,
): VoiceSignal {
  return {
    kind: 'transcript_matched',
    intent,
    transcript,
    confidence,
  };
}
