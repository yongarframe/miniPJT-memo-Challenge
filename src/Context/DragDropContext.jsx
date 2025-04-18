import { createContext, useContext, useReducer, useRef } from "react";
import { todoReducer } from "../todoReducer";

const dragDropContext = createContext();

export function DragDropProvider({ children }) {
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [state, dispatch] = useReducer(todoReducer, []);

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

  return (
    <dragDropContext.Provider
      value={{ dragStart, dragEnter, drop, state, dispatch }}
    >
      {children}
    </dragDropContext.Provider>
  );
}

export function useDragDrop() {
  return useContext(dragDropContext);
}
