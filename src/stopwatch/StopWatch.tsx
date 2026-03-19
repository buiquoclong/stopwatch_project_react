import { useRef, useState, useEffect, useCallback } from "react";
import "./StopWatch.css";

const StopWatch = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);

  const intervalRef = useRef<number | null>(null);

  // Start / Resume
  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);

    intervalRef.current = window.setInterval(() => {
      setTime((prev) => prev + 10);
    }, 50);
  }, [isRunning]);

  // Stop
  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Reset
  const reset = () => {
    stop();
    setTime(0);
    setLaps([]);
  };

  // Lap
  const lap = () => {
    if (!isRunning) return;
    setLaps((prev) => [time, ...prev]);
  };

  // Format time
  const pad = (num: number): string => String(num).padStart(2, "0");

  const milliseconds = Math.floor((time % 1000) / 10);
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor(time / 60000);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();

        if (isRunning) {
          stop();
        } else {
          start();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, start, stop]);

  return (
    <div className="stopwatch-container">
      <h1>Stop Watch</h1>

      <div className="stopwatch-wrapper">
        <div className={`stopwatch ${isRunning ? "running" : ""}`}>
          {/* Time */}
          <div className="time-display">
            <span className="time-unit">{pad(minutes)}</span>
            <span className="colon">:</span>
            <span className="time-unit">{pad(seconds)}</span>
            <span className="colon">:</span>
            <span className="time-unit">{pad(milliseconds)}</span>
          </div>

          {/* Buttons */}
          <div className="buttons">
            {/* Left button */}
            <button
              className={`primary-btn ${isRunning ? "stop" : "start"}`}
              onClick={isRunning ? stop : start}
            >
              {isRunning ? "Stop" : "Start"}
            </button>

            {/* Right button */}
            <button
              className="secondary-btn"
              onClick={isRunning ? lap : reset}
              disabled={!isRunning && time === 0}
            >
              {isRunning ? "Lap" : "Reset"}
            </button>
          </div>
        </div>

        {/* Lap list chuyển sang bên phải */}
        <div className={`laps ${laps.length > 0 ? "has-lap" : ""}`}>
          <h3>Laps</h3>
          {laps.map((lapTime, index) => {
            const ms = Math.floor((lapTime % 1000) / 10);
            const sec = Math.floor((lapTime / 1000) % 60);
            const min = Math.floor(lapTime / 60000);

            return (
              <div className="lap-item" key={index}>
                <span>#{laps.length - index}</span>
                <span>
                  {pad(min)}:{pad(sec)}:{pad(ms)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StopWatch;
