export type SectionTestimony = {
  id: string;
  quote: string;
  displayLabel: string;
  isApproved: boolean;
};

const ROTATIONS = [-2, 0, 2, -1, 1];

type Props = { testimonies: SectionTestimony[]; introHtml: string };

export function ZeugnisseSection({ testimonies, introHtml }: Props) {
  const approved = testimonies.filter((t) => t.isApproved);
  const [opener, ...rest] = approved;

  return (
    <section id="zeugnisse" aria-labelledby="zeug-title" className="section section--zeug">
      <p className="mono zeug-lede" dangerouslySetInnerHTML={{ __html: introHtml }} />
      <h2 id="zeug-title" className="sr-only">Zeugnisse</h2>
      {opener ? (
        <blockquote className="zeug-opener display">
          {opener.quote}
          <cite className="mono zeug-cite">— {opener.displayLabel.toUpperCase()}</cite>
        </blockquote>
      ) : (
        <p className="mono">Noch keine freigegebenen Zeugnisse.</p>
      )}
      <ul className="zeug-grid">
        {rest.map((t, i) => (
          <li
            key={t.id}
            data-rot={ROTATIONS[i % ROTATIONS.length]}
            className="zeug-card"
          >
            <p className="zeug-card__quote">{t.quote}</p>
            <p className="mono zeug-card__cite">— {t.displayLabel.toUpperCase()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
