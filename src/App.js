import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlayFindTheMatch from "./FindTheMatch/PlayFindTheMatch";
import CreateFindTheMatch from "./FindTheMatch/CreateFindTheMatch";
import EditFindTheMatch from "./FindTheMatch/EditFindTheMatch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateFindTheMatch />} />
        <Route path="/play/:id" element={<PlayFindTheMatch />} />
        <Route path="/edit/:id" element={<EditFindTheMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
