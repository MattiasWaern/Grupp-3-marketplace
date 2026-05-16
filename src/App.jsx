import { Routes, Route } from "react-router-dom";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Start from "./pages/Start"
import CreateListing from "./pages/CreateListing";
import Listings from "./pages/Listings";

function Home(){
  return <h1>Home</h1>
}

function App(){
  return <> 

    <Header />

    <Routes>
      <Route path="/"element={<Start/> } />
      <Route path="/create"element={<CreateListing/> } />
      <Route path="/listings" element={<Listings />} />  
    </Routes>
    <main></main>
    
    <Footer />
    </>

}

export default App;