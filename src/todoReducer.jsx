export const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload];

    case "GET_DATA":
      return action.payload;

    case "TIME_STAMP":
      return state.map((el) =>
        el.id === action.payload[1] ? action.payload[0] : el
      );
    case "DELETE_TODO":
      return state.filter((el) => el.id !== action.payload.id);

    case "CORRECT_INPUT":
      return state.map((el) =>
        el.id === action.payload[0] ? { ...el, content: action.payload[1] } : el
      );
    case "TODO_COMPLETE":
      return state.map((el) =>
        el.id === action.payload[0].id
          ? { ...el, completed: action.payload[1] }
          : el
      );
    case "SORT_DATA":
      return [...action.payload.sort((a, b) => a.order - b.order)];

    case "ADD_DATE":
      return state.map((el) =>
        el.id === action.payload.id ? { ...el, ...action.payload } : el
      );

    default:
      return state;
  }
};
