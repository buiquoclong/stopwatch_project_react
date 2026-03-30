type Props = {
  city: string;
  timezone: string;
  onDelete: () => void;
};

const ClockCard = ({ city, timezone, onDelete }: Props) => {
  const now = new Date();

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">{city}</h2>
        <p className="text-sm text-gray-400">{timezone}</p>
      </div>

      <div className="text-2xl font-mono">{time}</div>

      <button onClick={onDelete} className="text-red-400 ml-4">
        ✕
      </button>
    </div>
  );
};

export default ClockCard;
