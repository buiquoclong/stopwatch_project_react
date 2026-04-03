import { useState, useRef, useEffect, useCallback } from "react";
import "./CountDown.css";

const CountDown = () => {
  const [time, setTime] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio("/alarm.mp3");
  }, []);
  const playAlarm = () => {
    console.log("🔥 playAlarm called"); // DEBUG

    if (audioRef.current) {
      audioRef.current.currentTime = 0;

      audioRef.current
        .play()
        .then(() => {
          console.log("✅ Audio played");
        })
        .catch((err) => {
          console.error("❌ Audio play failed:", err);
        });
    } else {
      console.log("❌ audioRef null");
    }
  };
  useEffect(() => {
    audioRef.current = new Audio("/alarm.mp3");

    audioRef.current.addEventListener("canplaythrough", () => {
      console.log("✅ Audio loaded OK");
    });

    audioRef.current.addEventListener("error", (e) => {
      console.error("❌ Audio load error", e);
    });
  }, []);
  // ===== Start =====
  const start = () => {
    if (isRunning || time <= 0) return;

    setIsRunning(true);
    setInitialTime(time);

    intervalRef.current = window.setInterval(() => {
      setTime((prev) => {
        if (prev <= 10) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          playAlarm();
          return 0;
        }
        return prev - 10;
      });
    }, 10);
  };
  // dừng đồng hồ nhưng giữ nguyên time để có thể tiếp tục start
  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };
  // dừng đồng hồ và reset time về 0
  const reset = () => {
    stop();
    setTime(0);
    setInitialTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // ===== Format =====
  const pad = (num: number) => String(num).padStart(2, "0");

  const ms = Math.floor((time % 1000) / 10);
  const sec = Math.floor((time / 1000) % 60);
  const min = Math.floor(time / 60000);

  // ===== Progress Circle =====
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = initialTime ? time / initialTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const isWarning = time <= 5000 && time > 0;
  const startWithTime = useCallback((newTime: number) => {
    // clear interval cũ
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setTime(newTime);
    setInitialTime(newTime);
    setIsRunning(true);

    intervalRef.current = window.setInterval(() => {
      setTime((prev) => {
        if (prev <= 10) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          playAlarm();
          return 0;
        }
        return prev - 10;
      });
    }, 10);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // tránh khi đang nhập input
      if (target.tagName === "INPUT") return;
      // ===== SPACE: toggle start/stop =====
      if (e.code === "Space") {
        e.preventDefault();

        if (isRunning) {
          // STOP
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
        } else {
          // START (chỉ khi có time)
          if (time > 0) {
            setIsRunning(true);

            intervalRef.current = window.setInterval(() => {
              setTime((prev) => {
                if (prev <= 10) {
                  clearInterval(intervalRef.current!);
                  setIsRunning(false);
                  playAlarm();
                  return 0;
                }
                return prev - 10;
              });
            }, 10);
          }
        }

        return; // tránh chạy xuống shortcuts
      }
      const shortcuts: Record<string, number> = {
        c: 45,
        a: 30,
        s: 60,
        d: 120,
      };

      const key = e.key.toLowerCase();

      if (shortcuts[key]) {
        e.preventDefault();

        const sec = shortcuts[key];
        const newTime = sec * 1000;

        startWithTime(newTime);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, time, startWithTime]);
  return (
    <div className="countdown-container">
      <h1 className="countdown-title">Count Down</h1>

      <div className="time-selector">
        {/* Preset */}
        <div className="preset-buttons">
          {[30, 45, 60, 120, 300].map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setTime(sec * 1000);
                setInitialTime(sec * 1000);
              }}
              disabled={isRunning}
            >
              {sec < 60 ? `${sec}s` : `${sec / 60}m`}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="custom-input">
          <input
            type="number"
            placeholder="Custom seconds..."
            onChange={(e) => {
              const value = Number(e.target.value);
              setTime(value * 1000);
              setInitialTime(value * 1000);
            }}
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="countdown-card">
        {/* Circle */}
        <div className="circle-wrapper">
          <svg className="progress-ring" width="220" height="220">
            <circle className="bg-ring" cx="110" cy="110" r={radius} />
            <circle
              className={`progress-ring-circle ${isWarning ? "warning" : ""}`}
              cx="110"
              cy="110"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          {/* Time */}
          <div className={`countdown-time ${isWarning ? "warning" : ""}`}>
            {pad(min)}:{pad(sec)}:{pad(ms)}
          </div>
        </div>

        {/* Buttons */}
        <div className="countdown-buttons">
          <button
            className={`primary ${isRunning ? "stop" : "start"}`}
            onClick={isRunning ? stop : start}
          >
            {isRunning ? "Stop" : "Start"}
          </button>

          <button className="secondary" onClick={reset}>
            Reset
          </button>
        </div>
        <p className="shortcut-hint">Press A = 30s • C = 45s </p>
        <p className="shortcut-hint">S = 60s • D = 120s</p>
      </div>
    </div>
  );
};

export default CountDown;
