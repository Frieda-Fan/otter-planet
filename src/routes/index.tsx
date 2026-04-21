import { Navigate, Route, Routes } from 'react-router-dom';
import { AdventurePage } from '../features/forest/pages/AdventurePage';
import { AdoptionPage } from '../features/onboarding/adoption/AdoptionPage';
import { LoginPage } from '../features/onboarding/auth/LoginPage';
import { LandingPage } from '../features/onboarding/landing/LandingPage';
import { SharePage } from '../features/share';
import { StoryRetellPage } from '../features/story-retell';
import { VideoResultPage } from '../features/video-result';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/adopt" element={<AdoptionPage />} />
      <Route path="/adventure" element={<AdventurePage />} />
      <Route path="/story-retell" element={<StoryRetellPage />} />
      <Route path="/video-result" element={<VideoResultPage />} />
      <Route path="/share" element={<SharePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
