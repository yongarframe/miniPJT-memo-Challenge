import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Clock } from "./Clcok";
import { useFetch } from "./customHook";
import { Timer } from "./Timer";
import { formatTime } from "./formatTime";
import { StopWatch } from "./StopWatch";
import { Advice } from "./Advice";
import { UpdateModal } from "./UpdateModal";
import BasicDatePicker from "./DatePicker";
import { useDragDrop } from "./Context/DragDropContext";
import { twMerge } from "tailwind-merge";

function App() {
  const [isLoading, data] = useFetch("http://localhost:3000/todo?_sort=order");
  const [currentTodo, setCurrentTodo] = useState(null);
  const [time, setTime] = useState(0);
  const [isTimer, setIsTimer] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isUndone, setIsUndone] = useState(false);
  const { state, dispatch } = useDragDrop();

  useEffect(() => {
    if (currentTodo) {
      fetch(`http://localhost:3000/todo/${currentTodo}`, {
        method: "PATCH",
        body: JSON.stringify({
          time: state.find((el) => el.id === currentTodo).time + 1,
        }),
      })
        .then((res) => res.json())
        .then((res) =>
          dispatch({ type: "TIME_STAMP", payload: [res, currentTodo] })
        );
    }
  }, [time]);

  useEffect(() => {
    setTime(0);
  }, [isTimer]);

  useEffect(() => {
    if (data) dispatch({ type: "GET_DATA", payload: data });
  }, [isLoading]);

  return (
    <>
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
        <TodoInput />
        <div className="todofilter flex">
          <button
            onClick={() => {
              setIsDone(true);
              setIsUndone(false);
            }}
          >
            완료목록
          </button>
          <button
            onClick={() => {
              setIsUndone(true);
              setIsDone(false);
            }}
          >
            미완료목록
          </button>
          <button
            onClick={() => {
              setIsUndone(false);
              setIsDone(false);
            }}
          >
            All
          </button>
        </div>
        <TodoList
          state={state}
          dispatch={dispatch}
          setCurrentTodo={setCurrentTodo}
          currentTodo={currentTodo}
          setIsModal={setIsModal}
          setCurrentInput={setCurrentInput}
          isDone={isDone}
          isUndone={isUndone}
        />
        {isModal && (
          <div
            className="position: absolute w-full h-full backdrop-blur-xs flex "
            onClick={() => setIsModal(!isModal)}
          >
            <UpdateModal
              setIsModal={setIsModal}
              currentInput={currentInput}
              setCurrentInput={setCurrentInput}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;

function TodoInput() {
  const { dispatch } = useDragDrop();
  const inputRef = useRef(null);
  const addTodo = () => {
    const newTodo = {
      content: inputRef.current.value,
      time: 0,
      completed: false,
    };
    fetch("http://localhost:3000/todo", {
      method: "POST",
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((res) => dispatch({ type: "ADD_TODO", payload: res }))
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
  setCurrentTodo,
  currentTodo,
  setIsModal,
  setCurrentInput,
  isDone,
  isUndone,
}) {
  const { state } = useDragDrop();
  return (
    <ul className="todoList flex">
      {state
        .filter((el) => {
          if (!isDone && !isUndone) return true;
          if (isDone && !isUndone) return el.completed === true;
          if (!isDone && isUndone) return el.completed === false;
        })
        .map((el, idx) => (
          <Todo
            key={el.id}
            todoList={el}
            setCurrentTodo={setCurrentTodo}
            currentTodo={currentTodo}
            setIsModal={setIsModal}
            setCurrentInput={setCurrentInput}
            isDone={isDone}
            isUndone={isUndone}
            idx={idx}
          />
        ))}
    </ul>
  );
}

function Todo({
  todoList,
  setCurrentTodo,
  currentTodo,
  setIsModal,
  setCurrentInput,
  idx,
}) {
  const [listChecked, setListChecked] = useState(todoList.completed);
  const { dragStart, dragEnter, drop, dispatch } = useDragDrop();

  return (
    <li
      className={twMerge(
        "flex",
        "bg-[rgb(213,134,134)]",
        "items-center",
        "justify-center",
        "w-[500px]",
        "gap-[20px]",
        "pr-[10px]",
        "rounded-xl",
        currentTodo === todoList.id &&
          "bg-[yellowgreen] text-[black] ease-linear duration-700 ",
        todoList.completed && "line-through"
      )}
      draggable
      onDragStart={(e) => dragStart(e, idx)} // drag&drop props 이벤트 App 컴포넌트에서 실행
      onDragEnter={(e) => dragEnter(e, idx)} // drag&drop props 이벤트 App 컴포넌트에서 실행
      onDragEnd={drop} // drag&drop props 이벤트 App 컴포넌트에서 실행
      onDragOver={(e) => e.preventDefault()} // drag&drop props 이벤트 App 컴포넌트에서 실행
    >
      <div className="w-40 h-10">
        <BasicDatePicker todoList={todoList} />
      </div>
      <input
        type="checkbox"
        checked={listChecked}
        onChange={() => {
          const newCheck = !listChecked;
          setListChecked(newCheck);
          const newTodo = { ...todoList, completed: newCheck };
          fetch(`http://localhost:3000/todo/${todoList.id}`, {
            method: "PATCH",
            body: JSON.stringify(newTodo),
          });
          dispatch({
            type: "TODO_COMPLETE",
            payload: [todoList, newCheck],
          });
          console.log(newCheck);
        }}
      />
      <div>
        {todoList.content}
        <br />
        {formatTime(todoList.time)}
      </div>
      <button onClick={() => setCurrentTodo(todoList.id)}>시작하기</button>
      <button
        onClick={() => {
          setIsModal((prev) => !prev);
          setCurrentInput([todoList.id, todoList.content]);
        }}
      >
        수정
      </button>
      <button
        className=""
        onClick={() => {
          fetch(`http://localhost:3000/todo/${todoList.id}`, {
            method: "DELETE",
          }).then((res) => {
            if (res.ok) {
              dispatch({ type: "DELETE_TODO", payload: todoList });
            }
          });
        }}
      >
        삭제
      </button>
    </li>
  );
}
