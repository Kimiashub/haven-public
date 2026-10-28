
import { Link, useLocation } from "react-router-dom";

function Header({ onLogout }) {
  const { pathname } = useLocation();
  const home = pathname === "/";

  return (
    <header className="site-header">
      <Link className="brand" to="/#home" aria-label="HAVEN home">
        <span className="brand-monogram">H</span>
        <span>HAVEN</span>
      </Link>

      <nav aria-label="Main navigation">
        <Link to="/">HOME</Link>
        <Link to="/rooms">ROOMS</Link>
        <Link to="/about">ABOUT</Link>
        <a href={home ? "#contact" : "/#contact"}>CONTACT</a>
      </nav>

      {onLogout ? (
        <button
          type="button"
          className="header-cta"
          onClick={onLogout}
        >
          LOG OUT
        </button>
      ) : (
        <a
          className="header-cta"
          href={home ? "#booking" : "#booking"}
        >
          BOOK YOUR STAY
        </a>
      )}
    </header>
  );
}

export default Header;


