export function UpdateModal({
  setIsModal,
  currentInput,
  setCurrentInput,
  state,
  dispatch,
}) {
  return (
    <div className="modal">
      <div>일정수정</div>
      <input
        value={currentInput[1]}
        onChange={(e) => setCurrentInput([currentInput[0], e.target.value])}
      ></input>
      <button
        onClick={() => {
          setIsModal((prev) => !prev);
          const currentTodo = state.filter((el) => el.id === currentInput[0]);
          const newTodo = { ...currentTodo, content: currentInput[1] };
          fetch(`http://localhost:3000/todo/${currentInput[0]}`, {
            method: "PATCH",
            body: JSON.stringify(newTodo),
          }).then((res) => {
            if (res.ok) {
              dispatch({ type: "CORRECT_INPUT", payload: currentInput });
              // setTodo(
              //   todo.map((el) =>
              //     el.id === currentInput[0]
              //       ? { ...el, content: currentInput[1] }
              //       : el
              //   )
              // );
            }
          });
        }}
      >
        저장하기
      </button>
    </div>
  );
}
