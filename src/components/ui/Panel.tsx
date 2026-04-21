type PanelProps = {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
};

export function Panel({
  title,
  eyebrow,
  children,
  className = '',
}: PanelProps) {
  return (
    <section className={`panel ${className}`.trim()}>
      {(eyebrow || title) && (
        <header className="panel__header">
          {eyebrow ? <p className="panel__eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
        </header>
      )}
      {children}
    </section>
  );
}
