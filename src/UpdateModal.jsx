import axios from "axios";
import { useDragDrop } from "./Context/DragDropContext";

export function UpdateModal({ setIsModal, currentInput, setCurrentInput }) {
  const { state, dispatch } = useDragDrop();
  return (
    <div
      className="bg-stone-100 flex w-90 h-90 flex-col items-center gap-[10px] absolute p-[10px] rounded-xl shadow-2xl top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      onClick={(e) => e.stopPropagation()}
    >
      <div>일정수정</div>
      <input
        className="w-80 h-100 p-[15px] rounded-2xl inset-shadow-sm/60"
        value={currentInput[1]}
        onChange={(e) => setCurrentInput([currentInput[0], e.target.value])} //currentInput 은 todo 컴포넌트 현재 값 [0]은 id / 1은 내용
      ></input>
      <button
        className="bg-violet-400 w-80"
        onClick={() => {
          setIsModal((prev) => !prev);
          const currentTodo = state.find((el) => el.id === currentInput[0]);
          const newTodo = { ...currentTodo, content: currentInput[1] };
          axios
            .patch(`http://localhost:3000/todo/${currentInput[0]}`, {
              content: newTodo.content,
            })
            // fetch(`http://localhost:3000/todo/${currentInput[0]}`, {
            //   method: "PATCH",
            //   body: JSON.stringify(newTodo.content),
            // })
            .then((res) => {
              // console.log(!!res);

              dispatch({ type: "CORRECT_INPUT", payload: newTodo });
            });
        }}
      >
        저장하기
      </button>
    </div>
  );
}
