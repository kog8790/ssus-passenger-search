import { useState } from "react";
import { Home, Search, ShoppingBag, Info } from "lucide-react";
import "./App.css";
import { searchPassengers } from "./services/supabase";

function formatSailingDate(dateString) {
  if (!dateString) return "Unknown";

  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const passengerResults = await searchPassengers(searchTerm);
      setResults(passengerResults);
    } catch (err) {
      console.error(err);
      setError("Unable to search the passenger archive.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

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
          <a>
            <Home className="nav-icon" aria-hidden="true" />
            <span>HOME</span>
          </a>

          <a>
            <Search className="nav-icon" aria-hidden="true" />
            <span>SEARCH</span>
          </a>

          <a>
            <ShoppingBag className="nav-icon" aria-hidden="true" />
            <span>SHOP</span>
          </a>

          <a>
            <Info className="nav-icon" aria-hidden="true" />
            <span>ABOUT</span>
          </a>
        </nav>
      </header>

      <section className="hero-section">
        <p className="eyebrow">VERIFIED HISTORICAL RECORDS</p>
        <h1>Passenger Manifest Archive</h1>
        <p className="intro">
          Explore over 93,000 passenger records across 175+ voyages aboard the
          SS United States.
        </p>
      </section>

      <form className="search-panel" onSubmit={handleSearch}>
        <label htmlFor="search">Search the Archive</label>

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
      </form>

      <section className="results-section">
        <div className="results-header">
          <h2>Search Results</h2>
          <span>
            {loading
              ? "Searching archive..."
              : results.length > 0
                ? `${results.length} record${results.length === 1 ? "" : "s"} found`
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

                  <div className="voyage-badge">
                    Voyage {passenger.voyage_number || "Unknown"}
                  </div>
                </div>

                <div className="manifest-body">
                  <div className="manifest-details">
                    <div className="manifest-row">
                      <span className="manifest-label">Voyage</span>
                      <span>{passenger.voyage_number || "Unknown"}</span>
                    </div>

                    <div className="manifest-row">
                      <span className="manifest-label">Passenger Class</span>
                      <span>{passenger.passenger_class || "Unknown"}</span>
                    </div>

                    <div className="manifest-row">
                      <span className="manifest-label">Cabin Number</span>
                      <span>{passenger.cabin_number || "Unknown"}</span>
                    </div>

                    <div className="manifest-row">
                      <span className="manifest-label">Sailing Date</span>
                      <span>{formatSailingDate(passenger.sailing_date)}</span>
                    </div>

                    <div className="manifest-row">
                      <span className="manifest-label">Direction</span>
                      <span>{passenger.direction || "Unknown"}</span>
                    </div>
                  </div>

                  <div className="manifest-route">
                    <span>{passenger.embarking_port || "Unknown"}</span>
                    <span className="route-arrow">→</span>
                    <span>{passenger.debarking_port || "Unknown"}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer">
        <div className="footer-quote">
          “The SS United States remains the fastest, greatest ocean liner ever built—
          a singular symbol of American engineering and maritime majesty.”
        </div>

        <div className="footer-bottom">
          <p>© 2026 Hull 488 Literary, LLC. All Rights Reserved.</p>

          <div className="footer-contact">
            <strong>Contact Us:</strong>
            <a href="mailto:ssusopguide@gmail.com">ssusopguide@gmail.com</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;