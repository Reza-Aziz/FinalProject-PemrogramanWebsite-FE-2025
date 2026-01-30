import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlayFindTheMatch from "./FindTheMatch/PlayFindTheMatch";
import MainMenu from "./FindTheMatch/MainMenu";
import EditFindTheMatch from "./FindTheMatch/EditFindTheMatch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/play/:id" element={<PlayFindTheMatch />} />
        <Route path="/edit/:id" element={<EditFindTheMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
