import { useEffect, useReducer, useRef, useState } from "react";
import "./App.css";
import { Clock } from "./Clcok";
import { useFetch } from "./customHook";
import { Timer } from "./Timer";
import { formatTime } from "./formatTime";
import { StopWatch } from "./StopWatch";
import { Advice } from "./Advice";
import { UpdateModal } from "./UpdateModal";
import { todoReducer } from "./todoReducer";

function App() {
  const [isLoading, data] = useFetch("http://localhost:3000/todo");
  // const [todo, setTodo] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [time, setTime] = useState(0);
  const [isTimer, setIsTimer] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [state, dispatch] = useReducer(todoReducer, []);

  useEffect(() => {
    if (currentTodo) {
      fetch(`http://localhost:3000/todo/${currentTodo}`, {
        method: "PATCH",
        body: JSON.stringify({
          time: state.find((el) => el.id === currentTodo).time + 1,
        }),
      })
        .then((res) => res.json())
        .then(
          (res) => dispatch({ type: "TIME_STAMP", payload: [res, currentTodo] })
          // setTodo((prev) =>
          //   prev.map((el) => (el.id === currentTodo ? res : el))
          // )
        ); //
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useEffect(() => {
    setTime(0);
  }, [isTimer]);

  useEffect(() => {
    if (data) dispatch({ type: "GET_DATA", payload: data });
    //setTodo(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <TodoInput state={state} dispatch={dispatch} />
      <div className="todofilter flex">
        <button>완료목록</button>
        <button>미완료목록</button>
        <button>All</button>
      </div>
      <TodoList
        state={state}
        dispatch={dispatch}
        setCurrentTodo={setCurrentTodo}
        currentTodo={currentTodo}
        setIsModal={setIsModal}
        setCurrentInput={setCurrentInput}
      />
      {isModal && (
        <div className="blurContainer">
          <UpdateModal
            setIsModal={setIsModal}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            state={state}
            dispatch={dispatch}
          />
        </div>
      )}
    </div>
  );
}

export default App;

function TodoInput({ dispatch }) {
  const inputRef = useRef(null);
  const addTodo = () => {
    const newTodo = {
      // id: Number(new Date()).toString(),
      content: inputRef.current.value,
      time: 0,
      competed: false,
    };
    fetch("http://localhost:3000/todo", {
      method: "POST",
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((res) => dispatch({ type: "ADD_TODO", payload: res }))
      // .then((res) => setTodo((prev) => [...prev, res]))
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

function TodoList({
  state,
  dispatch,
  setCurrentTodo,
  currentTodo,
  setIsModal,
  setCurrentInput,
}) {
  return (
    <ul className="todoList flex">
      {state.map((el) => (
        <Todo
          key={el.id}
          state={el}
          dispatch={dispatch}
          setCurrentTodo={setCurrentTodo}
          currentTodo={currentTodo}
          setIsModal={setIsModal}
          setCurrentInput={setCurrentInput}
        />
      ))}
    </ul>
  );
}

function Todo({
  state,
  dispatch,
  setCurrentTodo,
  currentTodo,
  setIsModal,
  setCurrentInput,
}) {
  // console.log(typeof state.id);
  return (
    <li className={`flex todo ${currentTodo === state.id ? "current" : ""}`}>
      <div>
        {state.content}
        <br />
        {formatTime(state.time)}
      </div>
      <button onClick={() => setCurrentTodo(state.id)}>시작하기</button>
      <button
        onClick={() => {
          setIsModal((prev) => !prev);
          setCurrentInput([state.id, state.content]);
        }}
      >
        수정
      </button>
      <button
        className=""
        onClick={() => {
          fetch(`http://localhost:3000/todo/${state.id}`, {
            method: "DELETE",
          }).then((res) => {
            if (res.ok) {
              // console.log(res);
              // setTodo((prev) => prev.filter((el) => el.id !== state.id));
              dispatch({ type: "DELETE_TODO", payload: state });
            }
          });
        }}
      >
        삭제
      </button>
    </li>
  );
}
