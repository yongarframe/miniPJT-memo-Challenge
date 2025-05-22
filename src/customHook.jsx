import { useEffect, useState } from "react";
import { useDragDrop } from "./Context/DragDropContext";

export function useFetch(url) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setData(res);
        setIsLoading(false);
      });
  }, [url]);

  return [isLoading, data];
}
