import { useEffect, useState } from "react";
import Counts from "../Analytics/counts/Counts";
import TempleList from "../main/temple/TempleList";
import "./Dashboard.css";
import { TempleController } from "../../services/Temple/temple.controller";
import { BookingController } from "../../services/booking/booking.controller";
import Bookings from "../main/Bookings/Booking";
import { useNavigate } from "react-router-dom";
type CountsProps = {
  temples: number | string;
  bookings: number | string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<CountsProps>({
    temples: 0,
    bookings: 0,
  });

  const templeService = TempleController.getInstance();
  const bookingService = BookingController.getInstance();

  const fetchAllCounts = async () => {
    try {
      const [temples, bookings] = await Promise.all([
        templeService.getTemples(),
        bookingService.getBookings(),
      ]);
      console.log(temples, "pp");
      console.log(bookings, "pp");
      setCounts({
        temples: temples.length,
        bookings: bookings?.data.pagination?.count,
      });
    } catch (error) {
      console.error("Failed to fetch counts:", error);
    }
  };

  useEffect(() => {
    fetchAllCounts();
  }, []);

  return (
    <div className={"widgets-container"}>
      <div className={"count-widgets-container-1"}>
        <Counts title={"Temple counts"} count={counts.temples} />
        <Counts title={"Booking"} count={counts.bookings} variant={"success"} />
      </div>
      <div className={"count-widgets-container-2"}>
        <Counts title={"Temple counts"} count={counts.temples} size={"large"} />
        <Counts
          title={"Booking"}
          count={counts.bookings}
          variant={"success"}
          size={"large"}
        />
        <Counts
          title={"Bookings"}
          count={counts.bookings}
          variant={"success"}
          size={"large"}
          onClick={() => {
            navigate("/bookings");
          }}
        />
      </div>
      <div className={"count-widgets-container-3"}>
        <Counts
          title={"Bookings"}
          count={counts.bookings}
          variant={"success"}
          size={"large"}
          onClick={() => {
            navigate("/bookings");
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
