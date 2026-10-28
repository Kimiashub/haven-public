
import { Link } from "react-router-dom";

function RoomCard({ room }) {
  return (
    <article className="room">
      <img src={room.image} alt={room.alt} />

      <div className="room-title">
        <h3>{room.name}</h3>
        <span>
          {room.price} CHF <small>/ night</small>
        </span>
      </div>

      <p>
        Bed &amp; Breakfast &nbsp; | &nbsp;
        1 bed &nbsp; | &nbsp;
        {room.guests} {room.guests === 1 ? "guest" : "guests"}
      </p>

      <div className="room-bottom">
        <Link to={`/rooms/${room.id}`} className="details">
          View more →
        </Link>

        <Link to={`/rooms/${room.id}`} className="room-button">
          SELECT ROOM
        </Link>
      </div>
    </article>
  );
}

export default RoomCard;
