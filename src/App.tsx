import { useState } from "react";
import "./App.css";
// import StopWatch from "./stopwatch/StopWatch";
// import CountDown from "./countdown/CountDown";
import { tabs } from "./tabs/tabs.config";
import type { TabItem } from "./tabs/tab.types";

function App() {
  // const [tab, setTab] = useState<"stopwatch_tab" | "countdown_tab">(
  //   "stopwatch_tab",
  // );
  const [tab, setTab] = useState<TabItem["id"]>("stopwatch_tab");

  const currentTab = tabs.find((t) => t.id === tab);
  const CurrentComponent = currentTab?.component;

  return (
    <div className="app-container">
      {/* Tabs */}
      <div
        className={`tabs ${tab}`}
        style={
          {
            "--tab-count": tabs.length,
            "--tab-index": tabs.findIndex((t) => t.id === tab),
          } as React.CSSProperties
        }
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content (có animation) */}
      <div className="tab-content">
        {/* {tab === "stopwatch_tab" ? <StopWatch /> : <CountDown />} */}
        {CurrentComponent && <CurrentComponent />}
      </div>
    </div>
  );
}

export default App;
