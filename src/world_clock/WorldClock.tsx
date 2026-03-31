import { useState } from "react";
import ClockCard from "./components/ClockCard";
import AddTimezone from "./components/AddTimezone";
import "./WorldClock.css";

type Timezone = {
  city: string;
  tz: string;
};

const WorldClock = () => {
  const [zones, setZones] = useState<Timezone[]>([
    { city: "Ho Chi Minh", tz: "Asia/Ho_Chi_Minh" },
  ]);

  const handleAdd = (zone: Timezone) => {
    if (!zones.find((z) => z.tz === zone.tz)) {
      setZones([...zones, zone]);
    }
  };

  const handleDelete = (tz: string) => {
    setZones(zones.filter((z) => z.tz !== tz));
  };

  return (
    <div className="world-clock">
      <h1 className="world-clock__title">🌍 World Clock</h1>

      <AddTimezone onAdd={handleAdd} />

      <div className="world-clock__list">
        {zones.map((zone) => (
          <ClockCard
            key={zone.tz}
            city={zone.city}
            timezone={zone.tz}
            onDelete={() => handleDelete(zone.tz)}
          />
        ))}
      </div>
    </div>
  );
};

export default WorldClock;
