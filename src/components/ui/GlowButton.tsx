import { Link } from 'react-router-dom';

type GlowButtonProps = {
  to: string;
  children: React.ReactNode;
  tone?: 'gold' | 'forest' | 'sky';
};

export function GlowButton({
  to,
  children,
  tone = 'gold',
}: GlowButtonProps) {
  return (
    <Link className={`glow-button glow-button--${tone}`} to={to}>
      {children}
    </Link>
  );
}
