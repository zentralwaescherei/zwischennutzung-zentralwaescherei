type Props = { enabled: boolean; label: string; latestPostSlug: string | null };

export function VoteModeStrap({ enabled, label, latestPostSlug }: Props) {
  if (!enabled) return null;
  return (
    <aside className="vote-strap mono" role="complementary">
      <span>{label}</span>
      {latestPostSlug ? (
        <a href={`/blog/${latestPostSlug}`}>ZUM AKTUELLSTEN BEITRAG →</a>
      ) : null}
    </aside>
  );
}
