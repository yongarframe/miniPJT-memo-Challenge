import { useEffect, useRef, useState } from "react";
import { formatTime } from "./formatTime";

export function Timer({ time, setTime }) {
  const [startTime, setStartTime] = useState(0);
  const [isOn, setIsOn] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn && time > 0) {
      const timerId = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      timerRef.current = timerId;
    } else if (!isOn || time == 0) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isOn, time]);

  //time 이 있을 때는 startTime 표시 없을 때는 time 표시
  return (
    <div>
      <div>
        {time ? formatTime(time) : formatTime(startTime)}
        <button
          className=""
          onClick={() => {
            setIsOn(true);
            setTime(time ? time : startTime);
            setStartTime(0);
          }}
        >
          시작
        </button>
        <button
          onClick={() => {
            setTime(0);
            setIsOn(false);
          }}
        >
          리셋
        </button>
        <button
          className=""
          onClick={() => {
            setTime(0);
            setIsOn(false);
          }}
        >
          멈춤
        </button>
      </div>
      <input
        type="range"
        value={startTime}
        max="3600"
        step="30"
        min="0"
        onChange={(e) => setStartTime(e.target.value)}
      />
    </div>
  );
}
