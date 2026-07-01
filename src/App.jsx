import { useState } from "react";
import "./App.css";
import { searchPassengers } from "./services/supabase";

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

        <nav>
          <a>HOME</a>
          <a>SHOP</a>
          <a className="active">PASSENGER SEARCH</a>
          <a>ABOUT</a>
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
                <h3>{passenger.full_name || "Unnamed Passenger"}</h3>

                <div className="result-grid">
                  <p>
                    <strong>Voyage:</strong>{" "}
                    {passenger.voyage_number || "Unknown"}
                  </p>
                  <p>
                    <strong>Sailing Date:</strong>{" "}
                    {passenger.sailing_date || "Unknown"}
                  </p>
                  <p>
                    <strong>Direction:</strong>{" "}
                    {passenger.direction || "Unknown"}
                  </p>
                  <p>
                    <strong>Class:</strong>{" "}
                    {passenger.passenger_class || "Unknown"}
                  </p>
                  <p>
                    <strong>Embarked:</strong>{" "}
                    {passenger.embarking_port || "Unknown"}
                  </p>
                  <p>
                    <strong>Debarked:</strong>{" "}
                    {passenger.debarking_port || "Unknown"}
                  </p>
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