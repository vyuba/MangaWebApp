import Card from "../components/Card";
import SearchInput from "../components/SearchInput";
import { useMangas } from "../contextApi/useMangas";

function Dasboard() {
  const { mangas, isLoadingMangas } = useMangas();

  // if (isLoadingMangas) {
  //   return (
  //     <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
  //       {Array(10)
  //         .fill(null)
  //         .map((_, index) => (
  //           <div
  //             key={index}
  //             className="border-border max-w-full h-full border bg-secondary p-3 flex flex-col gap-3"
  //           >
  //             <div className="card-img w-full h-[350px] overflow-hidden bg-cover bg-no-repeat bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader"></div>
  //             <div className="py-2 flex flex-col gap-4">
  //               <h5 className="font-medium w-full h-3 bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader"></h5>
  //               <p className="font-light w-full h-3 bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader"></p>
  //             </div>
  //           </div>
  //         ))}
  //     </div>
  //   );
  // }

  console.log(mangas);

  const MangaList = mangas?.map((manga) => {
    return <Card key={manga.id} manga={manga} />;
  });

  return (
    <>
      <div className="w-full flex justify-center">
        <SearchInput />
      </div>
      <div className="w-full h-full">
        <h3 className="font-medium text-lg pb-4">Dashboard</h3>
        {isLoadingMangas && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="border-border max-w-full h-full border bg-secondary p-3 flex flex-col gap-3"
                >
                  <div className="card-img w-full h-[350px] overflow-hidden bg-cover bg-no-repeat bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader"></div>
                  <div className="py-2 flex flex-col gap-4">
                    <h5 className="font-medium w-full h-3 bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader"></h5>
                    <p className="font-light w-full h-3 bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader"></p>
                  </div>
                </div>
              ))}
          </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] h-full bg-inherit gap-2">
          {MangaList}
        </div>
      </div>
    </>
  );
}

export default Dasboard;
