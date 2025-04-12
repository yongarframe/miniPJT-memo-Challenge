import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [isLoading, data] = useFetch("http://localhost:3000/todo");
  const [todo, setTodo] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [time, setTime] = useState(0);
  const [isTimer, setIsTimer] = useState(false);

  useEffect(() => {
    if (currentTodo) {
      fetch(`http://localhost:3000/todo/${currentTodo}`, {
        method: "PATCH",
        body: JSON.stringify({
          time: todo.find((el) => el.id === currentTodo).time + 1,
        }),
      })
        .then((res) => res.json())
        .then((res) =>
          setTodo((prev) =>
            prev.map((el) => (el.id === currentTodo ? res : el))
          )
        );
    }
  }, [time]);

  useEffect(() => {
    setTime(0);
  }, [isTimer]);

  useEffect(() => {
    if (data) setTodo(data);
  }, [isLoading]);
  return (
    <>
      <Clock />
      <button onClick={() => setIsTimer((prev) => !prev)}>
        {isTimer ? "스톱워치로변경" : "타이머로변경"}
      </button>
      {isTimer ? (
        <Timer time={time} setTime={setTime} />
      ) : (
        <StopWatch time={time} setTime={setTime} />
      )}
      <Advice />
      <TodoInput setTodo={setTodo} todo={todo} />
      <TodoList
        todo={todo}
        setTodo={setTodo}
        setCurrentTodo={setCurrentTodo}
        currentTodo={currentTodo}
      />
    </>
  );
}

function TodoInput({ setTodo }) {
  const inputRef = useRef(null);
  const addTodo = () => {
    const newTodo = {
      // id: Number(new Date()),
      content: inputRef.current.value,
      time: 0,
    };
    fetch("http://localhost:3000/todo", {
      method: "POST",
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((res) => setTodo((prev) => [...prev, res]));
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <input
          className="w-100 min-h-14 border-1 shadow-xl border-sky-500 rounded-xl pl-2 font-sans"
          ref={inputRef}
        />
        <button
          className="text-yellow-50 w-10 h-8 bg-green-400 rounded-md"
          onClick={addTodo}
        >
          추가
        </button>
      </div>
    </>
  );
}

export default App;

function TodoList({ todo, setTodo, setCurrentTodo, currentTodo }) {
  return (
    <ul className="flex flex-col gap-2 mt-2 bg-pink-200 rounded-xl">
      {todo.map((el) => (
        <Todo
          key={el.id}
          todo={el}
          setTodo={setTodo}
          setCurrentTodo={setCurrentTodo}
          currentTodo={currentTodo}
        />
      ))}
    </ul>
  );
}

function Todo({ todo, setTodo, setCurrentTodo, currentTodo }) {
  return (
    <li
      className={`text-yellow-50 w-100 flex items-center justify-end gap-1  rounded-xl ${
        currentTodo === todo.id ? "bg-amber-700" : "bg-blue-400"
      }`}
    >
      <div>
        {todo.content}
        <br />
        {formatTime(todo.time)}
      </div>
      <button onClick={() => setCurrentTodo(todo.id)}>시작하기</button>
      <button
        className="text-yellow-50 w-10 h-8 bg-red-400 rounded-md ml-10"
        onClick={() => {
          fetch(`http://localhost:3000/todo/${todo.id}`, {
            method: "DELETE",
          }).then((res) => {
            if (res.ok) {
              setTodo((prev) => prev.filter((el) => el.id !== todo.id));
            }
          });
        }}
      >
        삭제
      </button>
    </li>
  );
}

function useFetch(url) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setIsLoading(false);
      });
  }, [url]);

  return [isLoading, data];
}

function Advice() {
  const [isLoading, data] = useFetch(
    "https://korean-advice-open-api.vercel.app/api/advice"
  );

  return (
    <>
      {!isLoading && (
        <>
          <div>{data.message}</div>
          <div>-{data.author}-</div>
        </>
      )}
    </>
  );
}

function Timer({ time, setTime }) {
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

  return (
    <div>
      <div>
        {time ? formatTime(time) : formatTime(startTime)}
        <button
          className="text-yellow-50 w-10 h-8 bg-green-400 rounded-md"
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
          className="text-yellow-50 w-10 h-8 bg-green-400 rounded-md"
          onClick={() => {
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

function formatTime(second) {
  const timeString = `${String(Math.floor(second / 3600)).padStart(
    2,
    "0"
  )}:${String(Math.floor((second % 3600) / 60)).padStart(2, "0")}:${String(
    second % 60
  ).padStart(2, "0")}`;

  return timeString;
}

function StopWatch({ time, setTime }) {
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
  }, [isOn]);

  return (
    <>
      {formatTime(time)}
      <button
        className="text-yellow-50 w-10 h-8 bg-green-400 rounded-md"
        onClick={() => setIsOn((prev) => !prev)}
      >
        {isOn ? "끄기" : "켜기"}
      </button>
      <button
        className="text-yellow-50 w-10 h-8 bg-green-400 rounded-md"
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

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return <div>{time.toLocaleTimeString()}</div>;
}
