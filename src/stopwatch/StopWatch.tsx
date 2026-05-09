import { useRef, useState, useEffect, useCallback } from "react";
import "./StopWatch.css";

const StopWatch = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);

  const intervalRef = useRef<number | null>(null);

  // Start, Resume(Chức năng bắt đầu, tiếp tục chạy sau khi đã dừng)
  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);

    const startTime = Date.now() - time;

    intervalRef.current = window.setInterval(() => {
      setTime(Date.now() - startTime);
    }, 10);
  }, [isRunning, time]);

  // Chức năng dừng, tạm dừng
  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Chức năng đặt lại đồng hồ về 0 và xóa tất cả các lap đã ghi lại
  const reset = () => {
    stop();
    setTime(0);
    setLaps([]);
  };

  //  Chức năng ghi lại thời gian hiện tại vào danh sách lap khi đồng hồ đang chạy
  const lap = () => {
    if (!isRunning) return;
    setLaps((prev) => [time, ...prev]);
  };

  // Format time (phút:giây:phần trăm giây) với hàm pad để đảm bảo luôn hiển thị 2 chữ số
  const pad = (num: number): string => String(num).padStart(2, "0");

  const milliseconds = Math.floor((time % 1000) / 10);
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor(time / 60000);

  // Space key event to Start/Stop
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

        {/* Lap list ở bên phải */}
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
