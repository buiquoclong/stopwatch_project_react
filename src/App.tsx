import { useState } from "react";
import "./App.css";
import StopWatch from "./stopwatch/StopWatch";
import CountDown from "./countdown/CountDown";

function App() {
  const [tab, setTab] = useState<"stopwatch_tab" | "countdown_tab">(
    "stopwatch_tab",
  );

  return (
    <div className="app-container">
      {/* Tabs */}
      <div className={`tabs ${tab}`}>
        <button
          className={tab === "stopwatch_tab" ? "active" : ""}
          onClick={() => setTab("stopwatch_tab")}
        >
          Stopwatch
        </button>

        <button
          className={tab === "countdown_tab" ? "active" : ""}
          onClick={() => setTab("countdown_tab")}
        >
          Countdown
        </button>
      </div>

      {/* Content (có animation) */}
      <div className="tab-content">
        {tab === "stopwatch_tab" ? <StopWatch /> : <CountDown />}
      </div>
    </div>
  );
}

export default App;
