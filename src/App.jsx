import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateListing from "./pages/CreateListing";

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"element={<Home/> } />
        <Route path="/create"element={<CreateListing/> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;