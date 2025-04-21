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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOn, time]);

  //time 이 있을 때는 startTime 표시 없을 때는 time 표시
  return (
    <div className="flex items-center gap-[10px]">
      <div className="flex rounded-md gap-[10px] bg-f0fdf4">
        <div className="flex items-center justify-center text-3xl font-mono text-gray-800 mb-4">
          {time ? formatTime(time) : formatTime(startTime)}
        </div>
        <div className="flex gap-[10px] justify-around">
          <button
            className="bg-teal-500 text-white font-semibold rounded-full py-2 px-4 hover:bg-teal-600"
            onClick={() => {
              setIsOn(true);
              setTime(time ? time : startTime);
              setStartTime(0);
            }}
          >
            시작
          </button>
          <button
            className="bg-gray-200 text-gray-600 font-semibold rounded-full py-2 px-4 hover:bg-gray-300"
            onClick={() => {
              setTime(0);
              setIsOn(false);
            }}
          >
            리셋
          </button>
          <button
            className="bg-gray-200 text-gray-600 font-semibold rounded-full py-2 px-4 hover:bg-gray-300"
            onClick={() => {
              setTime(0);
              setIsOn(false);
            }}
          >
            멈춤
          </button>
        </div>
      </div>
      <input
        className="h-5"
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
