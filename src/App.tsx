import PlayFindTheMatch from "@/FindTheMatch/PlayFindTheMatch";
import EditFindTheMatch from "@/FindTheMatch/EditFindTheMatch";
import MainMenu from "@/FindTheMatch/MainMenu";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/play/:id" element={<PlayFindTheMatch />} />
      <Route path="/edit/:id" element={<EditFindTheMatch />} />
    </Routes>
  );
}

export default App;
