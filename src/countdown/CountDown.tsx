import { useState, useRef, useEffect, useCallback } from "react";
import "./CountDown.css";
// Khai báo mục lịch sử với id, duration (thời gian đếm ngược đã hoàn thành) và finishedAt (thời gian hoàn thành)
type HistoryItem = {
  id: number;
  duration: number;
  finishedAt: string;
};
const CountDown = () => {
  const [time, setTime] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const hasSavedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  // ===== Audio =====
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio("/alarm.mp3");
  }, []);
  // Gọi âm thanh khi đồng hồ kết thúc
  const playAlarm = () => {
    console.log(" playAlarm called"); // DEBUG

    // Đảm bảo audio đã được load trước khi phát
    if (audioRef.current) {
      // Reset âm thanh về đầu để đảm bảo nó phát từ đầu mỗi lần
      audioRef.current.currentTime = 0;

      // Thử phát âm thanh và log kết quả
      audioRef.current
        .play()
        .then(() => {
          console.log("✅ Audio played");
        })
        .catch((err) => {
          console.error(" Audio play failed:", err);
        });
    } else {
      console.log(" audioRef null");
    }
  };
  // Lưu lịch sử mỗi khi đồng hồ kết thúc
  const saveHistory = useCallback((duration: number) => {
    const now = new Date();

    const item: HistoryItem = {
      id: Date.now(),
      duration: duration,
      finishedAt: now.toLocaleTimeString(),
    };

    setHistory((prev) => [item, ...prev]);
  }, []);
  // Load âm thanh một lần khi component mount
  useEffect(() => {
    // Tạo đối tượng Audio và gán vào ref
    audioRef.current = new Audio("/alarm.mp3");

    // Lắng nghe sự kiện load và error để debug
    audioRef.current.addEventListener("canplaythrough", () => {
      console.log("✅ Audio loaded OK");
    });

    // Lắng nghe lỗi tải âm thanh (nếu có lỗi tải âm thanh, sẽ log lỗi này  )
    audioRef.current.addEventListener("error", (e) => {
      console.error(" Audio load error", e);
    });
  }, []);
  // ===== Start (bắt đầu đếm ngược) =====
  const start = () => {
    if (isRunning || time <= 0) return;

    hasSavedRef.current = false;

    setIsRunning(true);
    setInitialTime(time);

    intervalRef.current = window.setInterval(() => {
      setTime((prev) => {
        if (prev <= 10) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          if (!hasSavedRef.current) {
            hasSavedRef.current = true;
            playAlarm();
            saveHistory(initialTime);
          }
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

  // ===== Format (thời gian)=====
  const pad = (num: number) => String(num).padStart(2, "0");

  const ms = Math.floor((time % 1000) / 10);
  const sec = Math.floor((time / 1000) % 60);
  const min = Math.floor(time / 60000);

  // ===== Progress Circle ===== (Điều chỉnh bán kính, chu vi và offset của vòng tròn tiến trình
  // dựa trên thời gian còn lại so với thời gian ban đầu) =====
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = initialTime ? time / initialTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  // Cảnh báo khi thời gian còn lại <= 5s
  const isWarning = time <= 5000 && time > 0;
  // ===== Thực hiện start với thời gian mới (dùng cho shortcuts) =====
  const startWithTime = useCallback(
    (newTime: number) => {
      // clear interval cũ
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      hasSavedRef.current = false;

      setTime(newTime);
      setInitialTime(newTime);
      setIsRunning(true);

      // cài đặt thời gian countdown đếm ngược đúng với thời gian theo đơn vị
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => {
          if (prev <= 10) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (!hasSavedRef.current) {
              hasSavedRef.current = true;
              playAlarm();
              saveHistory(newTime);
            }
            return 0;
          }
          return prev - 10;
        });
      }, 10);
    },
    [saveHistory],
  );

  // ===== Shortcuts (Keyboard), xử lý các phím tắt từ bàn phím =====
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // tránh khi đang nhập input
      if (target.tagName === "INPUT") return;
      // ===== SPACE: toggle start/stop (Xử lý sự kiện space)=====
      if (e.code === "Space") {
        e.preventDefault();

        // nếu đang chạy thì stop, nếu đang dừng thì start (chỉ khi có time)
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
            hasSavedRef.current = false;

            const duration = time;
            setIsRunning(true);

            intervalRef.current = window.setInterval(() => {
              setTime((prev) => {
                if (prev <= 10) {
                  clearInterval(intervalRef.current!);
                  setIsRunning(false);
                  if (!hasSavedRef.current) {
                    hasSavedRef.current = true;
                    playAlarm();
                    saveHistory(duration);
                  }
                  return 0;
                }
                return prev - 10;
              });
            }, 10);
          }
        }

        return; // tránh chạy xuống shortcuts
      }
      // danh sách shortcuts được định nghĩa sẵn với key là phím bấm và value là thời gian tương ứng (đơn vị: giây)
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
  }, [isRunning, time, startWithTime, saveHistory]);

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
      <div className="main-layout">
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
        <div className="history">
          <h3>History</h3>

          {history.length === 0 ? (
            <p className="empty">No countdown yet</p>
          ) : (
            <div className="history-grid">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="time">⏱ {item.duration / 1000}s</div>
                  <div className="done">✅ {item.finishedAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountDown;
