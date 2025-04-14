import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date()); // 시간초기값 설정

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []); // 빈배열 때문에 1번만 렌더링 됨

  return <div>{time.toLocaleTimeString()}</div>;
}
