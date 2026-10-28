import { useEffect, useState } from "react";
import {
    useParams,
    useSearchParams,
    useLocation,
    Link,
} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { rooms } from "../data/rooms";

function RoomDetails() {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        if (location.hash !== "#booking") return;

        const frame = requestAnimationFrame(() => {
            document.getElementById("booking")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });

        return () => cancelAnimationFrame(frame);
    }, [location.pathname, location.hash]);

    const room = rooms.find((item) => item.id === roomId);

    const [galleryIndex, setGalleryIndex] = useState(0);
    const [booking, setBooking] = useState({
        checkin: searchParams.get("checkin") || "",
        checkout: searchParams.get("checkout") || "",
        adults: searchParams.get("adults") || "2",
        children: searchParams.get("children") || "0",
        name: "",
        email: "",
        phone: "",
    });
    const [message, setMessage] = useState("");

    if (!room) {
        return (
            <>
                <Header />
                <main className="room-not-found">
                    <h1>Room not found</h1>
                    <Link to="/#rooms">← Back to rooms</Link>
                </main>
                <Footer />
            </>
        );
    }

    // Uses the room image until additional gallery images are added.
    const galleryImages = room.gallery?.length
        ? room.gallery
        : [room.image];

    const visibleImages = Array.from(
        { length: 3 },
        (_, index) =>
            galleryImages[(galleryIndex + index) % galleryImages.length]
    );

    function changeGallery(direction) {
        setGalleryIndex((previous) =>
            (previous + direction + galleryImages.length) %
            galleryImages.length
        );
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setBooking((previous) => ({
            ...previous,
            [name]: value,
        }));
    }


    async function handleBooking(event) {
        event.preventDefault();

        if (!booking.checkin || !booking.checkout ||
            booking.checkout <= booking.checkin) {
            setMessage("Check-out must be after check-in.");
            return;
        }

        const bookingData = {
            roomType: room.id,
            name: booking.name,
            email: booking.email,
            phone: booking.phone,
            checkin: booking.checkin,
            checkout: booking.checkout,
            adults: Number(booking.adults),
            children: Number(booking.children),
        };

        try {
            setMessage("Processing your booking...");

            const response = await fetch(
                "http://localhost:3000/api/bookings",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bookingData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Booking failed.");
            }

            setMessage(
                `Booking confirmed! Your booking number is #${data.booking.id}.`
            );

        } catch (error) {
            setMessage(error.message);
        }
    }


    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const amenities = [
        ["♧", "KING-SIZE BED", "Premium bedding"],
        ["⌁", "FREE WIFI", "High-speed"],
        ["❄", "AIR CONDITIONING", "Individual control"],
        ["♨", "MINIBAR", "Selection of drinks"],
        ["♧", "RAIN SHOWER", "Premium toiletries"],
        ["▣", "FLATSCREEN TV", "Streaming services"],
    ];

    const values = [
        ["♧", "THOUGHTFUL DESIGN", "Natural materials and calm aesthetics"],
        ["☼", "UNFORGETTABLE VIEWS", "Enjoy stunning surroundings"],
        ["♡", "A PLACE TO BELONG", "More than just a stay"],
    ];

    return (
        <>
            <Header />

            <main>
                {/* ROOM HERO */}
                <section
                    className="room-hero"
                    style={{ backgroundImage: `url(${room.image})` }}
                >
                    <div className="hero-overlay"></div>

                    <div className="hero-content">
                        <p className="eyebrow">OUR ROOMS</p>
                        <h1 id="room-name">{room.name}</h1>
                        <p className="hero-subtitle">
                            SPACIOUS · ELEGANT · TIMELESS
                        </p>
                    </div>
                </section>

                {/* IMAGE GALLERY */}
                <section className="gallery">
                    <button
                        className="gallery-arrow"
                        onClick={() => changeGallery(-1)}
                        aria-label="Previous images"
                        type="button"
                    >
                        ←
                    </button>

                    <div className="gallery-images">
                        {visibleImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${room.name} interior ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        className="gallery-arrow"
                        onClick={() => changeGallery(1)}
                        aria-label="Next images"
                        type="button"
                    >
                        →
                    </button>
                </section>

                {/* ROOM INFORMATION */}
                <section className="room-details">
                    <div className="room-description">
                        <p className="eyebrow">A HOME AWAY FROM HOME</p>

                        <h2>
                            Comfort in
                            <br />
                            every detail
                        </h2>

                        <p id="room-description">
                            {room.description ||
                                "A serene and welcoming retreat, designed with natural materials, soft textures and modern comfort — perfect for a relaxing stay at HAVEN."}
                        </p>

                        <div className="small-divider"></div>

                        <Link to="/#rooms" className="text-link">
                            VIEW MORE ROOMS <span>→</span>
                        </Link>
                    </div>

                    {/* AMENITIES */}
                    <div className="amenities">
                        {amenities.map(([icon, title, description]) => (
                            <div className="amenity" key={title}>
                                <span className="amenity-icon">{icon}</span>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BOOKING SECTION */}
                <section className="booking-section" id="booking">
                    <div
                        className="booking-image"
                        style={{ backgroundImage: `url(${room.image})` }}
                    ></div>

                    <div className="booking-content">
                        <h2>Book your stay</h2>

                        <form id="booking-form" onSubmit={handleBooking}>
                            <div className="form-grid">
                                <div className="form-field">
                                    <label htmlFor="checkin">CHECK-IN</label>
                                    <input
                                        type="date"
                                        id="checkin"
                                        name="checkin"
                                        min={localToday}
                                        value={booking.checkin}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="checkout">CHECK-OUT</label>
                                    <input
                                        type="date"
                                        id="checkout"
                                        name="checkout"
                                        min={booking.checkin || localToday}
                                        value={booking.checkout}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="adults">ADULTS</label>
                                    <select
                                        id="adults"
                                        name="adults"
                                        value={booking.adults}
                                        onChange={handleChange}
                                    >
                                        {[1, 2, 3, 4].map((number) => (
                                            <option key={number} value={number}>
                                                {number}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="children">CHILDREN</label>
                                    <select
                                        id="children"
                                        name="children"
                                        value={booking.children}
                                        onChange={handleChange}
                                    >
                                        {[0, 1, 2].map((number) => (
                                            <option key={number} value={number}>
                                                {number}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="guest-fields">
                                <label htmlFor="guest-name">FULL NAME</label>
                                <input
                                    type="text"
                                    id="guest-name"
                                    name="name"
                                    placeholder="Your full name"
                                    value={booking.name}
                                    onChange={handleChange}
                                    required
                                />

                                <label htmlFor="guest-email">EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    id="guest-email"
                                    name="email"
                                    placeholder="Your email"
                                    value={booking.email}
                                    onChange={handleChange}
                                    required
                                />

                                <label htmlFor="guest-phone">PHONE NUMBER</label>
                                <input
                                    type="tel"
                                    id="guest-phone"
                                    name="phone"
                                    placeholder="Your phone number"
                                    value={booking.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="booking-button">
                                CONFIRM BOOKING
                            </button>

                            <p id="booking-message" role="status" aria-live="polite">
                                {message}
                            </p>
                        </form>
                    </div>
                </section>

                {/* HOTEL VALUES */}
                <section className="hotel-values">
                    {values.map(([icon, title, description]) => (
                        <div className="value" key={title}>
                            <span className="value-icon">{icon}</span>
                            <div>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            <Footer />
        </>
    );
}

export default RoomDetails;
