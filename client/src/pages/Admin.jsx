
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = "/api/bookings";

function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(event) {
        event.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                throw new Error(
                    data?.error || `Login failed (${response.status})`
                );
            }

            onLogin();
        } catch (error) {
            setError(error.message);
        }

    }

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">

                <div className="admin-login-brand">HAVEN</div>
                <p className="admin-login-subtitle">
                    Hotel Management
                </p>

                <h1 className="admin-login-title">Welcome Back</h1>

                <p className="admin-login-description">
                    Sign in to access your management dashboard.
                </p>

                <form className="admin-login-form" onSubmit={handleLogin}>
                    <div className="admin-login-field">
                        <label htmlFor="admin-username">Username</label>
                        <input
                            id="admin-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="admin-login-field">
                        <label htmlFor="admin-password">Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="admin-login-error">{error}</p>
                    )}

                    <button className="admin-login-button" type="submit">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

function Admin() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch("/api/admin/me");

                if (!response.ok) {
                    throw new Error("Could not check session");
                }

                const data = await response.json();
                setIsLoggedIn(data.isAdmin);
            } catch (error) {
                console.error(error);
                setIsLoggedIn(false);
            } finally {
                setCheckingSession(false);
            }
        }

        checkSession();
    }, []);

    async function fetchBookings() {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Could not load bookings.");
            }

            const data = await response.json();
            setBookings(data);
            setMessage("");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchBookings();
        }
    }, [isLoggedIn]);

    function startEditing(booking) {
        setEditingId(booking.id);
        setFormData({ ...booking });
        setMessage("");
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function saveBooking(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        roomType: formData.roomType,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        checkin: formData.checkin,
                        checkout: formData.checkout,
                        adults: Number(formData.adults),
                        children: Number(formData.children),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not update booking.");
            }

            setEditingId(null);
            await fetchBookings();
            setMessage("Booking updated!");
        } catch (error) {
            setMessage(error.message);
        }
    }

    async function deleteBooking(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this booking?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not delete booking.");
            }

            await fetchBookings();
            setMessage("Booking deleted");
        } catch (error) {
            setMessage(error.message);
        }

    }

    async function handleLogout() {
  try {
    const response = await fetch("/api/admin/logout", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Could not log out");
    }

    setIsLoggedIn(false);
    setBookings([]);
    setEditingId(null);
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

    if (checkingSession) {
        return <p>Loading...</p>;
    }

    if (!isLoggedIn) {
        return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
    }


    return (
        <>
            <Header onLogout={handleLogout} />



            <main className="admin-page">
                <div className="admin-container">
                    <p className="eyebrow">HAVEN MANAGEMENT</p>
                    <h1>Booking Administration</h1>
                    <p className="admin-intro">
                        Manage reservations, update guest details and
                        remove bookings.
                    </p>

                    {message && (
                        <p className="admin-message" role="status">
                            {message}
                        </p>
                    )}

                    {loading ? (
                        <p>Loading bookings...</p>
                    ) : bookings.length === 0 ? (
                        <p>No bookings found.</p>
                    ) : (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Guest</th>
                                        <th>Room</th>
                                        <th>Check-in</th>
                                        <th>Check-out</th>
                                        <th>Guests</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>#{booking.id}</td>

                                            <td>
                                                <strong>{booking.name}</strong>
                                                <span>{booking.email}</span>
                                                <span>{booking.phone}</span>
                                            </td>

                                            <td>{booking.roomType}</td>
                                            <td>{booking.checkin}</td>
                                            <td>{booking.checkout}</td>

                                            <td>
                                                {booking.adults} adults
                                                <span>{booking.children} children</span>
                                            </td>

                                            <td>
                                                <div className="admin-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditing(booking)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() => deleteBooking(booking.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {editingId !== null && (
                        <section className="admin-edit-section">
                            <h2>Edit booking #{editingId}</h2>

                            <form onSubmit={saveBooking} className="admin-edit-form">
                                <label>
                                    Room type
                                    <select
                                        name="roomType"
                                        value={formData.roomType || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="single">Cosy Room</option>
                                        <option value="double">Double Room</option>
                                        <option value="view">Double Room Matterhorn View</option>
                                    </select>
                                </label>

                                <label>
                                    Full name
                                    <input
                                        name="name"
                                        value={formData.name || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Email
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Phone
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Check-in
                                    <input
                                        type="date"
                                        name="checkin"
                                        value={formData.checkin || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Check-out
                                    <input
                                        type="date"
                                        name="checkout"
                                        min={formData.checkin || undefined}
                                        value={formData.checkout || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Adults
                                    <input
                                        type="number"
                                        name="adults"
                                        min="1"
                                        value={formData.adults ?? 1}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Children
                                    <input
                                        type="number"
                                        name="children"
                                        min="0"
                                        value={formData.children ?? 0}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <div className="admin-form-buttons">
                                    <button type="submit">SAVE CHANGES</button>

                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => setEditingId(null)}
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Admin;
