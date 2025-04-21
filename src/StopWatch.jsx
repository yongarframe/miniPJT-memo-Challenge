import { useEffect, useRef, useState } from "react";
import { formatTime } from "./formatTime";

export function StopWatch({ time, setTime }) {
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn === true) {
      const timerId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      timerRef.current = timerId;
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOn]);

  return (
    <>
      <div className="text-3xl font-mono text-gray-800 mb-4">
        {formatTime(time)}
      </div>
      <button
        className={`rounded-full py-2 px-4 ${
          isOn
            ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
            : "bg-teal-500 text-white hover:bg-teal-600"
        }`}
        onClick={() => setIsOn((prev) => !prev)}
      >
        {isOn ? "끄기" : "켜기"}
      </button>
      <button
        className="bg-amber-100 text-amber-700 rounded-full py-2 px-4 hover:bg-amber-200"
        onClick={() => {
          setTime(0);
          setIsOn(false);
        }}
      >
        리셋
      </button>
    </>
  );
}
