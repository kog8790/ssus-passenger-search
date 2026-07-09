import { useState, useRef } from "react";
import { Home, ShipWheel, ShoppingBag, Info } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

import "./App.css";
import { searchPassengers } from "./services/archiveApi";

function formatSailingDate(dateString) {
  if (!dateString) return "Not Recorded";

  const date = new Date(`${dateString}T12:00:00`);

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const monthDayYear = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `${weekday}, ${monthDayYear}`;
}

function displayValue(value) {
  return value || "Not Recorded";
}

function isUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

function formatPassengerName(passenger) {
  return [
    passenger.prefix,
    passenger.first_name,
    passenger.middle_name,
    passenger.last_name,
    passenger.suffix,
  ]
    .filter(Boolean)
    .join(" ");
}

function toRomanNumeral(number) {
  if (!Number.isInteger(number) || number <= 0) {
    return "";
  }

  const romanMap = [
    { value: 1000, numeral: "M" },
    { value: 900, numeral: "CM" },
    { value: 500, numeral: "D" },
    { value: 400, numeral: "CD" },
    { value: 100, numeral: "C" },
    { value: 90, numeral: "XC" },
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" },
  ];

  let result = "";
  let remaining = number;

  for (const { value, numeral } of romanMap) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [turnstileToken, setTurnstileToken] = useState("");
  const [pendingSearch, setPendingSearch] = useState(false);

  const turnstileContainerRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const resultsSectionRef = useRef(null);
  const pendingSearchTermRef = useRef("");

function showTurnstile() {
  setPendingSearch(true);
  setError("");

  if (!window.turnstile || !turnstileContainerRef.current) {
    setError("Archive verification is still loading. Please try again in a moment.");
    setPendingSearch(false);
    return;
  }

  if (turnstileWidgetId.current) {
    window.turnstile.remove(turnstileWidgetId.current);
    turnstileWidgetId.current = null;
  }

  turnstileWidgetId.current = window.turnstile.render(
    turnstileContainerRef.current,
    {
      sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      callback: (token) => {
        setTurnstileToken(token);
        setPendingSearch(false);
        runSearch(1, token, pendingSearchTermRef.current);
      },
      "expired-callback": () => {
        setTurnstileToken("");
        setPendingSearch(false);
      },
      "error-callback": () => {
        setTurnstileToken("");
        setPendingSearch(false);
        setError("Archive verification failed. Please try again.");
      },
    }
  );
}

async function runSearch(targetPage, token = "", term = pendingSearchTermRef.current) {
  setLoading(true);
  setError("");
  setHasSearched(true);

  try {
    const searchData = await searchPassengers(term, targetPage, token);

    setResults(searchData.results);
    setTotalCount(searchData.totalCount);
    setPage(targetPage);

    if (targetPage === 1) {
      setTurnstileToken("");

      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }

      setPendingSearch(false);
    }

    requestAnimationFrame(() => {
      resultsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  } catch (err) {
    console.error(err);
    setError(err.message);
    setResults([]);
  } finally {
    setLoading(false);
  }
}

async function handleSearch(event) {
  event.preventDefault();

  const submittedTerm = searchTerm.trim();
  pendingSearchTermRef.current = submittedTerm;

  setResults([]);
  setTotalCount(0);
  setPage(1);
  setTurnstileToken("");

  showTurnstile();
}

async function handlePageChange(nextPage) {
  runSearch(nextPage);
}

  const pageSize = 25;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasEarlierEntries = page > 1;
  const hasLaterEntries = page < totalPages;

  return (
    <main className="archive-page">
      <header className="site-header">
        <a className="logo-link" href="/">
          <img
            src="/hull_488_noBG.png"
            alt="Hull 488 Literary"
            className="site-logo"
          />
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="/under-construction.html">
            <Home className="nav-icon" aria-hidden="true" />
            <span>HOME</span>
          </a>

          <a href="https://ssus-passenger-search.netlify.app">
            <ShipWheel className="nav-icon" aria-hidden="true" />
            <span>SEARCH</span>
          </a>

          <a href="/under-construction.html">
            <ShoppingBag className="nav-icon" aria-hidden="true" />
            <span>SHOP</span>
          </a>

          <a href="/under-construction.html">
            <Info className="nav-icon" aria-hidden="true" />
            <span>ABOUT</span>
          </a>
        </nav>
      </header>

      <section className="hero-section">
        <h1>SS United States<br />Passenger Manifest Archive</h1>
        <p className="intro">
          Explore voyages of the SS United States — the fastest ocean liner ever built.
          Explore the manifests of those who sailed aboard, being added all the time!
        </p>
        <p className="scroll-note">
          Scroll down to find out how to contribute to the archive.
        </p>
      </section>

      <form className="search-panel" onSubmit={handleSearch}>
        <div className="search-row">
          <input
            id="search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by passenger name, voyage, class, or port..."
          />

          <button type="submit" disabled={loading}>
            {loading ? "SEARCHING..." : "SEARCH"}
          </button>
        </div>

        <div
          ref={turnstileContainerRef}
          className={pendingSearch ? "turnstile-wrap visible" : "turnstile-wrap"}
        />

        <div className="archive-stats">
          <div>
            <strong>95,000+</strong>
            <span>Passenger Records</span>
          </div>

          <div>
            <strong>180+</strong>
            <span>Voyages</span>
          </div>

          <div>
            <strong>1952–1969</strong>
            <span>Years Covered</span>
          </div>
        </div>

        <div className="manifest-ribbon">
          <strong>Passenger Manifest</strong>
          <span>S.S. United States • Pier 86 • New York City, NY</span>
        </div>
      </form>

      <section
        ref={resultsSectionRef}
        className="results-section"
      >
        <div className="results-header">
          <h2>Search Results</h2>
          <span>
            {loading
              ? "Searching archive..."
              : results.length > 0
                ? `Showing ${((page - 1) * pageSize) + 1}–${Math.min(page * pageSize, totalCount)} of ${totalCount} matching records`
                : hasSearched
                  ? "No records found."
                  : "Enter a search term to begin."}
          </span>
        </div>

        {error && <div className="empty-state">{error}</div>}

        {!error && !loading && results.length === 0 && (
          <div className="empty-state">
            <p>
              {hasSearched
                ? "No matching passenger records were found."
                : "Passenger records will appear here after searching."}
            </p>
          </div>
        )}

        {!error && results.length > 0 && (
          <div className="results-list">
            {results.map((passenger) => (
              <article
                className="result-card"
                key={passenger.passenger_record_id}
              >
                <div className="manifest-header">
                  <h3>{formatPassengerName(passenger) || "Unnamed Passenger"}</h3>
                </div>

                <div className="manifest-body">
                  <div className="manifest-details">
                    <div className="manifest-row">
                      <span className="manifest-label">Voyage</span>
                      <span>{displayValue(passenger.voyage_number)}</span>
                    </div>

                    <div className="manifest-row">
                      <span className="manifest-label">Passenger Class</span>
                      <span>{displayValue(passenger.passenger_class)}</span>
                    </div>

                    <div className="manifest-row">
                      <span className="manifest-label">Cabin Number</span>
                      <span>{displayValue(passenger.cabin_number)}</span>
                    </div>

                    <div className="manifest-row">
                      <span className="manifest-label">Sailing Date</span>
                      <span>{formatSailingDate(passenger.sailing_date)}</span>
                    </div>

                    <div className="manifest-row">
                      <span className="manifest-label">Direction</span>
                      <span>{displayValue(passenger.direction)}</span>
                    </div>
                  </div>

                  <div className="manifest-route">
                    <span>{displayValue(passenger.embarking_port)}</span>
                    <span className="route-arrow">→</span>
                    <span>{displayValue(passenger.debarking_port)}</span>
                  </div>

                  {passenger.ports_of_call && (
                    <div className="manifest-extra">
                      <span className="manifest-label manifest-extra-label">Ports of Call</span>
                      <p>{passenger.ports_of_call}</p>
                    </div>
                  )}

                  {passenger.notes && (
                  <div className="manifest-extra">
                    <span className="manifest-label manifest-extra-label">Notes</span>

                    {isUrl(passenger.notes) ? (
                      <a
                        href={passenger.notes}
                        target="_blank"
                        rel="noreferrer"
                        className="manifest-link"
                      >
                        Learn more
                      </a>
                    ) : (
                      <p>{passenger.notes}</p>
                    )}
                  </div>
                )}
                </div>
              </article>
            ))}
          </div>
        )}
      {!error && results.length > 0 && totalPages > 1 && (
        <div className="archive-pagination">
          <button
            type="button"
            className="archive-page-button"
            disabled={!hasEarlierEntries || loading}
            onClick={() => handlePageChange(page - 1)}
          >
            ◀ Earlier Entries
          </button>

          <div className="archive-page-label">
            Manifest Page {toRomanNumeral(page)} of {toRomanNumeral(totalPages)}
          </div>

          <button
            type="button"
            className="archive-page-button"
            disabled={!hasLaterEntries || loading}
            onClick={() => handlePageChange(page + 1)}
          >
            Later Entries ▶
          </button>
        </div>
      )}
      </section>

      <footer className="site-footer">
        <div className="contribute-section">
          <p className="archive-status">
            Passenger Manifest Archive • All records digitized from originals • For General Search Purposes Only
          </p>

          <h2>Contribute to the Archive</h2>

          <p>
            This archive is a work in progress and is not complete. More lists will be
            added as we acquire them. If you have a passenger list in digital format
            — readable PDF preferred, but JPG images are also fine — please contact us at:
          </p>

          <a href="mailto:ssusopguide@gmail.com">ssusopguide@gmail.com</a>

          <p className="thank-you">Thank you!</p>
        </div>

        <div className="footer-bottom">

          <div className="footer-left">
            <img
              src="/hull_488_noBG.png"
              alt="Hull 488 Literary"
              className="footer-logo"
            />

            <p>© 2026 Hull 488 Literary, LLC. All Rights Reserved.</p>
          </div>

          <div className="footer-contact">
            <div className="footer-contact-info">
              <strong>Contact Us:</strong>

              <a href="mailto:ssusopguide@gmail.com">
                ssusopguide@gmail.com
              </a>
            </div>

            <div className="footer-socials">
              <a
                href="https://www.facebook.com/share/1HHfNKwkbE/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/ssus_operational_guide"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>

          </div>

        </div>
      </footer>
    </main>
  );
}

export default App;