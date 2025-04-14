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

    default:
      return state;
  }
};
