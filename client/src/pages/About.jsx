
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import heroImage from "../images/hero.png";

function About() {
  return (
    <>
      <Header />


      <main className="about-page">
        <section
          className="about-hero"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="about-hero-overlay"></div>

          <div className="about-hero-content">
            <p className="eyebrow">WELCOME TO HAVEN</p>
            <h1>A place to feel at home.</h1>
            <p>
              Thoughtful hospitality. Timeless comfort.
              Unforgettable moments.
            </p>
          </div>
        </section>

        <section className="about-story">
          <div className="about-story-heading">
            <p className="eyebrow">OUR STORY</p>
            <h2>More than just a place to stay.</h2>
          </div>

          <div className="about-story-text">
            <p>
              At HAVEN, we believe that the most memorable
              experiences are often found in the simplest
              moments.
            </p>

            <p>
              Our spaces are designed to offer a sense of calm,
              where natural materials, thoughtful details and
              understated elegance come together.
            </p>

            <p>
              Whether you're visiting for a quiet escape or
              a new adventure, we want every stay to feel
              effortless, welcoming and personal.
            </p>
          </div>
        </section>

        <section className="about-values">
          <div className="about-values-heading">
            <p className="eyebrow">THE HAVEN EXPERIENCE</p>
            <h2>Stay a little longer.</h2>
          </div>

          <div className="about-values-grid">
            <div className="about-value">
              <span>01</span>
              <h3>Thoughtful Design</h3>
              <p>
                Beautifully considered spaces created
                for comfort and relaxation.
              </p>
            </div>

            <div className="about-value">
              <span>02</span>
              <h3>Personal Hospitality</h3>
              <p>
                A warm and welcoming atmosphere
                that makes every guest feel at home.
              </p>
            </div>

            <div className="about-value">
              <span>03</span>
              <h3>Meaningful Moments</h3>
              <p>
                Time to slow down, reconnect and
                enjoy the little things.
              </p>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <p className="eyebrow">YOUR NEXT ESCAPE AWAITS</p>
          <h2>Find your own haven.</h2>
          <Link to="/rooms" className="about-cta-button">
            EXPLORE OUR ROOMS →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
