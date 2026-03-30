import { useState } from "react";
import ClockCard from "./components/ClockCard";
import AddTimezone from "./components/AddTimezone";

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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">🌍 World Clock</h1>

      <AddTimezone onAdd={handleAdd} />

      <div className="grid gap-4">
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
