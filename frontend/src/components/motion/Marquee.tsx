type Props = { text: string; seconds?: number };

export function Marquee({ text, seconds = 40 }: Props) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" style={{ animationDuration: `${seconds}s` }}>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
