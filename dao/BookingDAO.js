
const db = require("../database");

class BookingDAO {
  create(booking) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO bookings
        (roomType, name, email, phone, checkin, checkout, adults, children)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        booking.roomType,
        booking.name,
        booking.email,
        booking.phone,
        booking.checkin,
        booking.checkout,
        booking.adults,
        booking.children,
      ];

      db.run(sql, values, function (error) {
        if (error) return reject(error);
        resolve({ id: this.lastID, ...booking });
      });
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM bookings ORDER BY id DESC",
        [],
        (error, rows) => {
          if (error) return reject(error);
          resolve(rows);
        }
      );
    });
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM bookings WHERE id = ?",
        [id],
        (error, row) => {
          if (error) return reject(error);
          resolve(row);
        }
      );
    });
  }

  update(id, booking) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE bookings
        SET roomType = ?, name = ?, email = ?, phone = ?,
            checkin = ?, checkout = ?, adults = ?, children = ?
        WHERE id = ?
      `;

      const values = [
        booking.roomType,
        booking.name,
        booking.email,
        booking.phone,
        booking.checkin,
        booking.checkout,
        booking.adults,
        booking.children,
        id,
      ];

      db.run(sql, values, function (error) {
        if (error) return reject(error);
        resolve(this.changes);
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM bookings WHERE id = ?",
        [id],
        function (error) {
          if (error) return reject(error);
          resolve(this.changes);
        }
      );
    });
  }
}

module.exports = new BookingDAO();
