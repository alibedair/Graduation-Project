import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import PopularProducts from "./Components/popularproducts";
import WelcomeSection from "./Components/WelcomeSection";


function App() {
  return (
    <div>
     <Navbar/>
     <WelcomeSection/>
     <PopularProducts/>
     <Footer/>
    </div>
  );
}

export default App;
