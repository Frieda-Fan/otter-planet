import { Link, useLocation } from 'react-router-dom';

type SceneShellProps = {
  sceneLabel: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const navItems = [
  { to: '/', label: '首页' },
  { to: '/login', label: '进入旅程' },
  { to: '/adopt', label: '领养伙伴' },
  { to: '/adventure', label: '森林冒险' },
];

export function SceneShell({
  sceneLabel,
  title,
  subtitle,
  children,
}: SceneShellProps) {
  const location = useLocation();

  return (
    <div className="scene-shell">
      <div className="scene-shell__backdrop" />
      <header className="topbar">
        <div>
          <p className="topbar__eyebrow">{sceneLabel}</p>
          <h1>{title}</h1>
        </div>
        <nav className="topbar__nav" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.to}
              className={location.pathname === item.to ? 'is-active' : ''}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="scene-shell__content">
        <div className="hero-copy">
          <p className="hero-copy__subtitle">{subtitle}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
