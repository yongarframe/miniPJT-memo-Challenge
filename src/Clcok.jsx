import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date()); // 시간초기값 설정

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return (
    <div className="text-gray-800 font-mono text-xl font-semibold">
      {time.toLocaleTimeString()}
    </div>
  );
}
