import "./index.css";
import Dasboard from "./pages/Dasboard";
import { BrowserRouter, Routes, Route } from "react-router";
import MangaPage from "./pages/MangaPage";
import SearchPage from "./pages/SearchPage";
import ChapterPage from "./pages/ChapterPage";
import BookmarkedPage from "./pages/BookmarkedPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthLayout from "./pages/auth/AuthLayout";
import DashboardLayout from "./pages/DashboardLayout";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dasboard />} />
            <Route path="manga/:id" element={<MangaPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="bookmark" element={<BookmarkedPage />} />
            <Route
              path="manga/:mangaId/:mangaTitle/chapter/:chapterId"
              element={<ChapterPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
