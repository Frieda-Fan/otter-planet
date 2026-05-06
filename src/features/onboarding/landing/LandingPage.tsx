import { otterCharacterImage } from '../../../assets/characters/otter';
import { GestureOnboarding } from './GestureOnboarding';

export function LandingPage() {
  return (
    <div className="starry-landing-page">
      <div className="starry-landing-page__stars" />
      <div className="starry-landing-page__stars starry-landing-page__stars--layer-two" />
      <div className="starry-landing-page__stars starry-landing-page__stars--layer-three" />
      <GestureOnboarding otterImage={otterCharacterImage} />
    </div>
  );
}
