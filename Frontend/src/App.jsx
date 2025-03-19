import "./App.css";
import { SidebarClose } from "lucide-react";
import SideBar from "./components/SideBar";
import Dasboard from "./pages/Dasboard";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import MangaPage from "./pages/MangaPage";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import ChapterPage from "./pages/ChapterPage";

function App() {
  const [shrink, setShrink] = useState(true);
  const handleSidebarShrink = () => {
    setShrink(!shrink);
  };

  return (
    <>
      <BrowserRouter>
        <div className="bg-background text-text w-screen h-screen md:flex md:flex-row relative">
          <div className="flex flex-row md:m-4 gap-2 transition-all">
            <SideBar shrink={shrink} />
            <button
              onClick={handleSidebarShrink}
              className="border-border  h-fit border bg-secondary p-2 z-30 hidden md:block"
            >
              <SidebarClose />
            </button>
          </div>
          <div
            id="content-container"
            className="px-4 py-4 flex flex-col gap-5 w-full h-full overflow-y-auto"
          >
            <Navbar />
            <div className="py-16 md:py-0 w-full  h-fit " />
            <Routes>
              <Route index element={<Dasboard />} />
              <Route path="/manga/:id" element={<MangaPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/manga/:mangaId/:mangaTitle/chapter/:chapterId"
                element={<ChapterPage />}
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
