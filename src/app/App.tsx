import { useLocation } from 'react-router-dom';
import { GestureControlPanel } from '../components/GestureControlPanel';
import { GestureProvider } from '../gesture/GestureProvider';
import { AppRoutes } from '../routes';

function AppBody() {
  const location = useLocation();
  const showGesturePanel =
    location.pathname === '/adopt' ||
    location.pathname === '/adventure';

  return (
    <>
      <AppRoutes />
      {showGesturePanel ? <GestureControlPanel /> : null}
    </>
  );
}

export function App() {
  return (
    <GestureProvider>
      <AppBody />
    </GestureProvider>
  );
}
