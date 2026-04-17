export function SiteFooter() {
  return (
    <footer className="site-footer mono" aria-labelledby="footer-title">
      <div className="site-footer__inner">
        <h2 id="footer-title" className="display site-footer__title">KOLOFON</h2>
        <div className="site-footer__columns">
          <section>
            <h3>KONTAKT</h3>
            <p>Zwischennutzung Zentralwäscherei<br />Zürich, 2026</p>
          </section>
          <section>
            <h3>LINKS</h3>
            <ul>
              <li><a href="/impressum">Impressum</a></li>
              <li><a href="/datenschutz">Datenschutz</a></li>
              <li><a href="https://github.com/zentralwaescherei/zwischennutzung-zentralwaescherei" rel="noreferrer">GitHub</a></li>
            </ul>
          </section>
          <section>
            <h3>ABSTIMMUNG</h3>
            <p>Juni 2026</p>
          </section>
        </div>
        <p className="site-footer__credit">© 2026 ZWISCHEN-NUTZUNG ZENTRAL-WAESCHEREI · GEBAUT MIT NEO-POSTER</p>
      </div>
    </footer>
  );
}
