import { TIMEZONES } from "../data/timezones";

type Props = {
  onAdd: (tz: { city: string; tz: string }) => void;
};

const AddTimezone = ({ onAdd }: Props) => {
  return (
    <div className="flex gap-2">
      {TIMEZONES.map((item) => (
        <button
          key={item.tz}
          onClick={() => onAdd(item)}
          className="bg-blue-500 px-3 py-1 rounded"
        >
          {item.city}
        </button>
      ))}
    </div>
  );
};

export default AddTimezone;
