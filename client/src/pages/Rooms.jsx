
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import { rooms } from "../data/rooms";

function Rooms() {
  return (
    <>
      <Header />

      <main className="all-rooms-page">
        <section className="all-rooms-intro">
          <p className="eyebrow">THE HAVEN COLLECTION</p>
          <h1>Our Rooms</h1>
          <p className="all-rooms-description">
            Discover thoughtfully designed spaces
            where comfort meets timeless elegance.
            Find the perfect room for your stay.
          </p>
        </section>

        <section className="all-rooms-section">
          <div className="all-rooms-grid">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>

        <section className="all-rooms-bottom">
          <p className="eyebrow">RELAX. RECONNECT. FEEL AT HOME.</p>
          <h2>Every stay tells a story.</h2>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Rooms;
