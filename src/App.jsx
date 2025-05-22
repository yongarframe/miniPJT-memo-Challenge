import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Clock } from "./Clock";
import { useFetch } from "./customHook";
import { Timer } from "./Timer";
import { formatTime } from "./formatTime";
import { StopWatch } from "./StopWatch";
import { Advice } from "./Advice";
import { UpdateModal } from "./UpdateModal";
import BasicDatePicker from "./DatePicker";
import { useDragDrop } from "./Context/DragDropContext";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

function App() {
  const [isLoading, data] = useFetch("http://localhost:3000/todo");
  const [currentTodo, setCurrentTodo] = useState(null);
  const [time, setTime] = useState(0);
  const [isTimer, setIsTimer] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isUndone, setIsUndone] = useState(false);
  const { state, dispatch } = useDragDrop();

  console.log(state);

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
      <div className="flex-col flex items-center gap-[20px] p-[10px] ">
        <Clock />
        <div className="flex gap-[10px] rounded-md p-4 bg-f0fdf4">
          <button
            className="bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-full py-2 px-4 text-sm flex items-center"
            onClick={() => setIsTimer((prev) => !prev)}
          >
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
        <div className="todofilter flex gap-[10px]">
          <button
            className="w-30"
            onClick={() => {
              setIsDone(true);
              setIsUndone(false);
            }}
          >
            완료목록
          </button>
          <button
            className="w-30"
            onClick={() => {
              setIsUndone(true);
              setIsDone(false);
            }}
          >
            미완료목록
          </button>
          <button
            className="w-30"
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
      <div className="flex gap-2 items-center py-3 px-4 bg-f0fdf4 rounded-md">
        <input
          placeholder="새로운 할 일을 입력하세요..."
          className="bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:border-teal-500 flex-grow"
          ref={inputRef}
        />
        <button
          className="bg-teal-500 flex items-center text-white font-semibold rounded-md py-2 px-4 ml-2 hover:bg-teal-600"
          onClick={addTodo}
        >
          추가
        </button>
      </div>
    </>
  );
}

const TodoList = memo(
  ({
    setCurrentTodo,
    currentTodo,
    setIsModal,
    setCurrentInput,
    isDone,
    isUndone,
  }) => {
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
);

const Todo = memo(
  ({
    todoList,
    setCurrentTodo,
    currentTodo,
    setIsModal,
    setCurrentInput,
    idx,
  }) => {
    const [listChecked, setListChecked] = useState(todoList.completed);
    const { dragStart, dragEnter, drop, dispatch } = useDragDrop();

    console.log(todoList);
    return (
      <li
        className={twMerge(
          "border-b-[2px] border-[#4db6ac] flex bg-[#ffffff] items-center justify-center w-[500px] gap-[10px] pr-[10px] rounded-xl",
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
        <div className="w-10 h-10">
          <BasicDatePicker todoList={todoList} />
        </div>
        <div className="text-[12px]">{`기한 : ${dayjs(todoList.date).format(
          "YY-MM-DD"
        )}`}</div>
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-teal-500 focus:ring-teal-500 rounded border-gray-300"
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
          }}
        />
        <div>
          {todoList.content}
          <br />
          {formatTime(todoList.time)}
        </div>
        <button
          className="w-15 text-[12px]"
          onClick={() => setCurrentTodo(todoList.id)}
        >
          시작하기
        </button>
        <button
          className="w-15 text-[12px]"
          onClick={() => {
            setIsModal((prev) => !prev);
            setCurrentInput([todoList.id, todoList.content]);
          }}
        >
          수정
        </button>
        <button
          className="w-15 text-[12px]"
          onClick={() => {
            fetch(`http://localhost:3000`, {
              method: "DELETE",
              body: todoList.id,
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
);
