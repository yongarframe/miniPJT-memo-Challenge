import { useFetch } from "./customHook";

export function Advice() {
  const [isLoading, data] = useFetch(
    "https://korean-advice-open-api.vercel.app/api/advice"
  );

  return (
    <>
      {!isLoading && (
        <>
          <div className=" flex flex-col items-center bg-[#f0fdf4] border-t border-gray-200 pt-4 pb-4 border-b">
            <p className="text-[#424242 font-serif text-lg leading-relaxed mb-3 p-1 border-gray-200 text-teal-500 font-semibold">
              {data.message}
            </p>
            <p className="text-amber-700 font-serif text-sm italic mb-3 p-1">
              - {data.author} -
            </p>
          </div>
        </>
      )}
    </>
  );
}
