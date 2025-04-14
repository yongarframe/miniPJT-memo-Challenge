import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Clock } from "./Clcok";
import { useFetch } from "./customHook";
import { Timer } from "./Timer";
import { formatTime } from "./formatTime";
import { StopWatch } from "./StopWatch";
import { Advice } from "./Advice";

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
    <div className="container flex">
      <Clock />
      <div className="timer flex">
        <button onClick={() => setIsTimer((prev) => !prev)}>
          {isTimer ? "스톱워치로변경" : "타이머로변경"}
        </button>
        {isTimer ? (
          <Timer time={time} setTime={setTime} />
        ) : (
          <StopWatch time={time} setTime={setTime} />
        )}
      </div>
      <Advice />
      <TodoInput setTodo={setTodo} todo={todo} />
      <TodoList
        todo={todo}
        setTodo={setTodo}
        setCurrentTodo={setCurrentTodo}
        currentTodo={currentTodo}
      />
    </div>
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
      .then((res) => setTodo((prev) => [...prev, res]))
      .then(() => (inputRef.current.value = ""));
  };

  return (
    <>
      <div className="">
        <input className="" ref={inputRef} />
        <button className="" onClick={addTodo}>
          추가
        </button>
      </div>
    </>
  );
}

export default App;

function TodoList({ todo, setTodo, setCurrentTodo, currentTodo }) {
  return (
    <ul className="todoList flex">
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
    <li className={`flex todo ${currentTodo === todo.id ? "current" : ""}`}>
      <div>
        {todo.content}
        <br />
        {formatTime(todo.time)}
      </div>
      <button onClick={() => setCurrentTodo(todo.id)}>시작하기</button>
      <button
        className=""
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
