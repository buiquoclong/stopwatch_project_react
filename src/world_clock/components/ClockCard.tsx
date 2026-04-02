import { useEffect, useState } from "react";
import "./Components.css";

type Props = {
  city: string;
  timezone: string;
  onDelete: () => void;
};

// Hiển thị thời gian hiện tại của một timezone cụ thể, đồng thời cung cấp nút xóa để loại bỏ timezone khỏi world clock
const ClockCard = ({ city, timezone, onDelete }: Props) => {
  const [time, setTime] = useState<string>("");
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  const handleDelete = () => {
    setIsRemoving(true);

    setTimeout(() => {
      onDelete();
    }, 300); // match CSS duration
  };

  return (
    <div className={`clock-card ${isRemoving ? "removing" : ""}`}>
      <div className="clock-card__info">
        <h2>{city}</h2>
        <p className="clock-card__timezone">{timezone}</p>
      </div>

      <div className="clock-card__time">{time}</div>

      <button
        onClick={handleDelete}
        className="clock-card__delete"
        aria-label="Delete timezone"
      >
        ✕
      </button>
    </div>
  );
};

export default ClockCard;
