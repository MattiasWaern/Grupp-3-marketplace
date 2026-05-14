import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateListing from "./pages/CreateListing";
import Listings from "./pages/Listings";

function Home(){
  return <h1>Home</h1>
}

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"element={<Home/> } />
        <Route path="/create"element={<CreateListing/> } />
        <Route path="/listings" element={<Listings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;