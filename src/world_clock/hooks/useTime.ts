import { useEffect, useState } from "react";

// Custom hook để cung cấp thời gian hiện tại, cập nhật mỗi giây kể từ thời điểm component được mount
export const useTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return now;
};
