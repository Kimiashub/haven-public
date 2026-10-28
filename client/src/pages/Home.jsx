
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import { rooms } from "../data/rooms";
import heroImage from "../images/hero.png";


function Home() {
    const navigate = useNavigate();

    const [search, setSearch] = useState({
        checkin: "",
        checkout: "",
        adults: "2",
        children: "0",
        room: "",
    });

    const [error, setError] = useState("");

    function handleChange(event) {
        const { id, value } = event.target;

        setSearch((previous) => ({
            ...previous,
            [id]: value,
        }));
    }

    function handleSearch(event) {
        event.preventDefault();

        if (!search.room) {
            alert("Please choose a room.");
            return;
        }

        if (!search.checkin || !search.checkout || search.checkout <= search.checkin) {
            alert("Please select valid check-in and check-out dates.");
            return;
        }

        const params = new URLSearchParams({
            checkin: search.checkin,
            checkout: search.checkout,
            adults: search.adults,
            children: search.children,
        });

        navigate(`/rooms/${search.room}?${params.toString()}#booking`);
    }

    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    return (
        <>
            <Header />

            <main>
                <section
                    className="hero"
                    id="home"
                    style={{ backgroundImage: `url(${heroImage})` }}
                >
                    <div className="hero-shade"></div>

                    <div className="hero-inner">
                        <div className="hero-copy">
                            <p className="eyebrow">WELCOME TO</p>
                            <h1>HAVEN</h1>

                            <p className="hero-tagline">
                                Relax. Reconnect. Feel at home.
                            </p>

                            <a className="explore" href="#rooms">
                                EXPLORE ROOMS <span aria-hidden="true">→</span>
                            </a>
                        </div>

                        <form
                            className="search-panel"
                            id="booking"
                            onSubmit={handleSearch}
                        >
                            <h2>Book your stay</h2>

                            <div className="field-grid">
                                <label>
                                    CHECK-IN
                                    <input
                                        id="checkin"
                                        type="date"
                                        min={localToday}
                                        value={search.checkin}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    CHECK-OUT
                                    <input
                                        id="checkout"
                                        type="date"
                                        min={search.checkin || localToday}
                                        value={search.checkout}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    ADULTS
                                    <select
                                        id="adults"
                                        value={search.adults}
                                        onChange={handleChange}
                                    >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </select>
                                </label>

                                <label>
                                    CHILDREN
                                    <select
                                        id="children"
                                        value={search.children}
                                        onChange={handleChange}
                                    >
                                        <option>0</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                    </select>
                                </label>
                            </div>

                            <div className="room-select-field">
                                <label htmlFor="room">CHOOSE YOUR ROOM</label>
                                <select
                                    id="room"
                                    name="room"
                                    value={search.room}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a room</option>
                                    <option value="single">Cosy Room Queen-Size Bed</option>
                                    <option value="double">Double Room</option>
                                    <option value="view">Double Room Matterhorn View</option>
                                </select>
                            </div>

                            <button className="gold-button" type="submit">
                                CHECK RATES
                            </button>

                            {error && <p role="alert">{error}</p>}
                        </form>
                    </div>
                </section>

                <section className="rooms" id="rooms">
                    <div className="rooms-heading">
                        <div>
                            <p className="eyebrow">OUR ROOMS</p>
                            <h2>Find your perfect stay</h2>
                        </div>

                        <p>
                            Thoughtfully designed rooms with modern comfort
                            <br />
                            and a warm, inviting atmosphere.
                        </p>

                        <Link to="/rooms">VIEW ALL ROOMS</Link>
                    </div>

                    <div className="room-grid" id="room-list">
                        {rooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Home;

