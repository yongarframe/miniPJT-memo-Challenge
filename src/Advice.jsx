import { useFetch } from "./customHook";

export function Advice() {
  const [isLoading, data] = useFetch(
    "https://korean-advice-open-api.vercel.app/api/advice"
  );

  return (
    <>
      {!isLoading && (
        <>
          <div>{data.message}</div>
          <div>-{data.author}-</div>
        </>
      )}
    </>
  );
}
