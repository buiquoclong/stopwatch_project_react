import StopWatch from "../stopwatch/StopWatch";
import CountDown from "../countdown/CountDown";
import WorldClock from "../world_clock/WorldClock";
import type { TabItem } from "./tab.types";

export const tabs: TabItem[] = [
  {
    id: "stopwatch_tab",
    label: "Stopwatch",
    component: StopWatch,
  },
  {
    id: "countdown_tab",
    label: "Countdown",
    component: CountDown,
  },
  {
    id: "worldclock_tab",
    label: "World Clock",
    component: WorldClock,
  },
];
