import "./App.css";

function App() {
  return (
    <main className="archive-page">
      <header className="site-header">
        <div className="brand">HULL 488 LITERARY, LLC</div>

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

      <section className="search-panel">
        <label htmlFor="search">Search the Archive</label>

        <div className="search-row">
          <input
            id="search"
            type="search"
            placeholder="Search by passenger name, voyage, class, or year..."
          />
          <button>SEARCH</button>
        </div>

        <div className="filters">
          <select>
            <option>All Classes</option>
            <option>First Class</option>
            <option>Cabin Class</option>
            <option>Tourist Class</option>
          </select>

          <select>
            <option>All Years</option>
          </select>

          <select>
            <option>All Voyages</option>
          </select>
        </div>
      </section>

      <section className="results-section">
        <div className="results-header">
          <h2>Search Results</h2>
          <span>Enter a search term to begin.</span>
        </div>

        <div className="empty-state">
          <p>
            Passenger records will appear here once the Supabase archive is
            connected.
          </p>
        </div>
      </section>

      <footer>
        <p>© 2026 Hull 488 Literary, LLC. All Rights Reserved.</p>
      </footer>
    </main>
  );
}

export default App;