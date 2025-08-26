import "./App.css";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/Faq.jsx";
import ViewContent from "./pages/Viewcontent.jsx";
import Instruction from "./pages/Instruction.jsx";




function App() {
  return (
    <>
     
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ/>} />
          <Route path="/view/:id" element={<ViewContent />} />
          <Route path="/how-to-use" element={<Instruction />} />
         
          
        </Routes>
      </Router>
      
     
    </>
  );
}

export default App;
