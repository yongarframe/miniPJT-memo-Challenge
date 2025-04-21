import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDragDrop } from "./Context/DragDropContext";
import { useState } from "react";
import EventIcon from "@mui/icons-material/Event";
import { IconButton } from "@mui/material";

export default function BasicDatePicker({ todoList }) {
  const initialDate = dayjs(todoList.date);
  const { dispatch } = useDragDrop();
  const [selectDate, setSelectDate] = useState(initialDate);
  const [open, setOpen] = useState(false);
  // setValue(todoList.date);
  // console.log(todoList.date);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <IconButton onClick={() => setOpen(true)}>
        <EventIcon />
      </IconButton>
      <DatePicker
        open={open}
        onClose={() => setOpen(false)}
        label="기한"
        value={selectDate}
        slotProps={{
          textField: {
            sx: {
              position: "absolute",
              width: 0,
              height: 0,
              padding: 0,
              border: 0,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            },
          },
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 10],
                },
              },
            ],
            sx: {
              left: "50% !important",
              top: "50% !important",
              transform: "translate(-50%, -50%) !important",
              position: "fixed !important",
              zIndex: 1500,
            },
          },
        }}
        onChange={(newValue) => {
          setSelectDate(newValue);
          const newTodo = {
            ...todoList,
            date: dayjs(newValue).format("YYYY-MM-DD"),
          };
          // console.log(newTodo);
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
