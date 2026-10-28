require("dotenv").config();

const session = require("express-session");
const bcrypt = require("bcryptjs");

const express = require("express");
const cors = require("cors");
const BookingDAO = require("./dao/BookingDAO");

const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"]
}));

app.use(express.json());

app.set("trust proxy", 1);
app.use(
  session({
    name: "haven.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    },
  })
);

function validateBooking(data) {
  const required = [
    "roomType", "name", "email", "phone",
    "checkin", "checkout"
  ];

  if (required.some((field) =>
    typeof data?.[field] !== "string" ||
    !data[field].trim()
  )) {
    return "Please fill in all required fields.";
  }

  const validDate = (value) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;

  if (!validDate(data.checkin) ||
    !validDate(data.checkout) ||
    data.checkout <= data.checkin) {
    return "Please select valid check-in and check-out dates.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Please enter a valid email address.";
  }

  if (!Number.isInteger(Number(data.adults)) ||
    Number(data.adults) < 1 ||
    !Number.isInteger(Number(data.children)) ||
    Number(data.children) < 0) {
    return "Please enter valid guest numbers.";
  }

  return null;
}

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const validUsername =
      username === process.env.ADMIN_USERNAME;

    const validPassword =
      typeof password === "string" &&
      await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
      );

    if (!validUsername || !validPassword) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        return res.status(500).json({
          error: "Could not start session",
        });
      }

      req.session.isAdmin = true;
      res.json({ message: "Login successful" });
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

function requireAdmin(req, res, next) {
  if (!req.session?.isAdmin) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
}

// CREATE BOOKING
app.post("/api/bookings", async (req, res) => {
  const error = validateBooking(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const booking = await BookingDAO.create(req.body);
    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: "Could not create booking" });
  }
});

// LIST BOOKINGS
app.get("/api/bookings", requireAdmin, async (req, res) => {
  try {
    const bookings = await BookingDAO.findAll();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch bookings" });
  }
});

// GET ONE BOOKING
app.get("/api/bookings/:id", requireAdmin, async (req, res) => {
  try {
    const booking = await BookingDAO.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch booking" });
  }
});

// UPDATE BOOKING
app.put("/api/bookings/:id", requireAdmin, async (req, res) => {
  const error = validateBooking(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const changes = await BookingDAO.update(
      req.params.id,
      req.body
    );

    if (!changes) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not update booking" });
  }
});

// DELETE BOOKING
app.delete("/api/bookings/:id", requireAdmin, async (req, res) => {
  try {
    const changes = await BookingDAO.delete(req.params.id);

    if (!changes) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete booking" });
  }
});

app.get("/api/admin/me", (req, res) => {
  res.json({
    isAdmin: req.session?.isAdmin === true,
  });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: "Logout failed",
      });
    }

    res.clearCookie("haven.sid");
    res.json({ message: "Logged out" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


