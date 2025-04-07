import Card from "../components/Card";
// import { useMangas } from "../contextApi/useMangas";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

function Dasboard() {
  const { isPending, error, data } = useQuery({
    queryKey: ["All Mangas"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${apiUrl}/proxy?url=/manga/`, {
          params: {
            limit: 50,
            offset: 10,
            availableTranslatedLanguage: ["en"],
          },
        });
        return response.data.data.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    staleTime: Infinity,
    cacheTime: 300000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2">
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
    );
  }
  {
    error && (
      <div className="bg-secondary transition-all w-fit  border-red-500 border h-fit p-3 flex gap-2 flex-col">
        <p className="font-medium capitalize text-lg">error</p>
        <span className="capitalize">an error occured please bare with us</span>
      </div>
    );
  }

  // console.log(data);

  // const MangaList = data?.map((manga) => {
  //   return <Card key={manga.id} manga={manga} />;
  // });

  // const MangaThriller = mangas?.map((manga) => {
  //   return <Card key={manga.id} manga={manga} />;
  // });

  const romanceMangas = data
    ?.filter((manga) =>
      manga?.attributes?.tags?.some(
        (tag) => tag?.attributes?.name?.en === "Romance"
      )
    )
    .map((manga) => {
      return <Card key={manga.id} manga={manga} />;
    });
  const schoolMangas = data
    ?.filter((manga) =>
      manga?.attributes?.tags?.some(
        (tag) => tag?.attributes?.name?.en === "School Life"
      )
    )
    .map((manga) => {
      return <Card key={manga.id} manga={manga} />;
    });
  const actionMangas = data
    ?.filter((manga) =>
      manga?.attributes?.tags?.some(
        (tag) => tag?.attributes?.name?.en === "Action"
      )
    )
    .map((manga) => {
      return <Card key={manga?.id} manga={manga} />;
    });
  const sciFiMangas = data
    ?.filter((manga) =>
      manga?.attributes?.tags?.some(
        (tag) => tag?.attributes?.name?.en === "Sci-Fi"
      )
    )
    .map((manga) => {
      return <Card key={manga.id} manga={manga} />;
    });
  const dramaMangas = data
    ?.filter((manga) =>
      manga?.attributes?.tags?.some(
        (tag) => tag?.attributes?.name?.en === "Drama"
      )
    )
    .map((manga) => {
      return <Card key={manga.id} manga={manga} />;
    });

  return (
    <>
      <div className="w-full h-full">
        {/* {isLoadingMangas && (
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
        )} */}
        <div>
          <h3 className="font-medium text-lg pb-4">Action</h3>

          <div className="grid  grid-cols-[repeat(auto-fit,minmax(170px,1fr))] h-full bg-inherit gap-2">
            {actionMangas}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg pb-4">Romance</h3>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] h-full bg-inherit gap-2">
            {romanceMangas}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg pb-4">Sci-Fi</h3>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] h-full bg-inherit gap-2">
            {sciFiMangas}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg pb-4">Drama</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] h-full bg-inherit gap-2">
            {dramaMangas}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg pb-4">School Life</h3>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] h-full bg-inherit gap-2">
            {schoolMangas}
          </div>
        </div>
        {/* <div>
          <h3 className="font-medium text-lg pb-4">Romance</h3>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] h-full bg-inherit gap-2">
            {romanceMangas}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg pb-4">Sci-Fi</h3>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] h-full bg-inherit gap-2">
            {sciFiMangas}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg pb-4">Drama</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] h-full bg-inherit gap-2">
            {dramaMangas}
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Dasboard;
