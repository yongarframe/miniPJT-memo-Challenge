import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDragDrop } from "./Context/DragDropContext";

export default function BasicDatePicker({ todoList }) {
  const [value, setValue] = React.useState(null);
  const { state, dispatch } = useDragDrop();
  // setValue(todoList.date);
  console.log(todoList.date);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Basic example"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          const newTodo = { ...todoList, date: newValue };
          console.log(newTodo);
          fetch(`http://localhost:3000/todo/${todoList.id}`, {
            method: "PATCH",
            body: JSON.stringify(newTodo),
          }).then((res) => {
            if (res.of) {
              dispatch({ type: "CORRECT_INPUT", payload: newTodo });
            }
          });
        }}
        format="YYYY-MM-DD"
        // renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
