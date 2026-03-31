import { TIMEZONES } from "../data/timezones";
import "./Components.css";
type Props = {
  onAdd: (tz: { city: string; tz: string }) => void;
};

const AddTimezone = ({ onAdd }: Props) => {
  return (
    <div className="add-timezone">
      {TIMEZONES.map((item) => (
        <button
          key={item.tz}
          onClick={() => onAdd(item)}
          className="add-timezone__btn"
        >
          {item.city}
        </button>
      ))}
    </div>
  );
};

export default AddTimezone;
