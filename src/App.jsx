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
  const [isLoading, data] = useFetch("http://localhost:3000/todo?_sort=order");
  // const [todo, setTodo] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [time, setTime] = useState(0);
  const [isTimer, setIsTimer] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [state, dispatch] = useReducer(todoReducer, []);
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [isDone, setIsDone] = useState(false);
  const [isUndone, setIsUndone] = useState(false);

  // 드래그 앤 드랍 기능
  // 드래그 시작
  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  //드래그 오버
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  //드래그 드랍시
  const drop = () => {
    const newList = [...state];
    const dragItemValue = newList[dragItem.current];
    newList.splice(dragItem.current, 1);
    newList.splice(dragOverItem.current, 0, dragItemValue);
    dragItem.current = null;
    dragOverItem.current = null;
    const updatedItems = newList.map((el, idx) => ({ ...el, order: idx }));
    dispatch({ type: "SORT_DATA", payload: updatedItems });
    updatedItems.forEach((item) => {
      fetch(`http://localhost:3000/todo/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ order: item.order }),
      });
    });
  };

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
        dragStart={dragStart} // drag&drop props 전달
        dragEnter={dragEnter} // drag&drop props 전달
        drop={drop} // drag&drop props 전달
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
      completed: false,
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
  isDone,
  isUndone,
  dragStart,
  dragEnter,
  drop,
}) {
  return (
    <ul className="todoList flex">
      {!isDone &&
        !isUndone &&
        state.map((el, idx) => (
          <Todo
            key={el.id}
            state={el}
            dispatch={dispatch}
            setCurrentTodo={setCurrentTodo}
            currentTodo={currentTodo}
            setIsModal={setIsModal}
            setCurrentInput={setCurrentInput}
            isDone={isDone}
            isUndone={isUndone}
            dragStart={dragStart} // drag&drop props 전달
            dragEnter={dragEnter} // drag&drop props 전달
            drop={drop} // drag&drop props 전달
            idx={idx}
          />
        ))}
      {isDone &&
        !isUndone &&
        state.map((el, idx) =>
          el.completed === true ? (
            <Todo
              key={el.id}
              state={el}
              dispatch={dispatch}
              setCurrentTodo={setCurrentTodo}
              currentTodo={currentTodo}
              setIsModal={setIsModal}
              setCurrentInput={setCurrentInput}
              isDone={isDone}
              isUndone={isUndone}
              dragStart={dragStart} // drag&drop props 전달
              dragEnter={dragEnter} // drag&drop props 전달
              drop={drop} // drag&drop props 전달
              idx={idx}
            />
          ) : (
            ""
          )
        )}
      {!isDone &&
        isUndone &&
        state.map((el, idx) =>
          el.completed === false ? (
            <Todo
              key={el.id}
              state={el}
              dispatch={dispatch}
              setCurrentTodo={setCurrentTodo}
              currentTodo={currentTodo}
              setIsModal={setIsModal}
              setCurrentInput={setCurrentInput}
              isDone={isDone}
              isUndone={isUndone}
              dragStart={dragStart} // drag&drop props 전달
              dragEnter={dragEnter} // drag&drop props 전달
              drop={drop} // drag&drop props 전달
              idx={idx}
            />
          ) : (
            ""
          )
        )}
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
  dragStart,
  dragEnter,
  drop,
  idx,
}) {
  // console.log(typeof state.id);
  const [listChecked, setListChecked] = useState(state.completed);

  return (
    <li
      className={`flex todo ${currentTodo === state.id ? "current" : ""} ${
        state.completed ? "done" : ""
      }`}
      draggable
      onDragStart={(e) => dragStart(e, idx)} // drag&drop props 이벤트 App 컴포넌트에서 실행
      onDragEnter={(e) => dragEnter(e, idx)} // drag&drop props 이벤트 App 컴포넌트에서 실행
      onDragEnd={drop} // drag&drop props 이벤트 App 컴포넌트에서 실행
      onDragOver={(e) => e.preventDefault()} // drag&drop props 이벤트 App 컴포넌트에서 실행
    >
      <input
        type="checkbox"
        checked={listChecked}
        onChange={() => {
          const newCheck = !listChecked;
          setListChecked(newCheck);
          const newTodo = { ...state, completed: newCheck };
          fetch(`http://localhost:3000/todo/${state.id}`, {
            method: "PATCH",
            body: JSON.stringify(newTodo),
          });
          dispatch({
            type: "TODO_COMPLETE",
            payload: [state, newCheck],
          });
          console.log(newCheck);
        }}
      />
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
