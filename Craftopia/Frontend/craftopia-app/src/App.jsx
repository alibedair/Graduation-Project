import BestSellingProducts from "./Components/BestSellingProducts";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import NewestItems from "./Components/NewestItems";
import PopularProducts from "./Components/popularproducts";
import WelcomeSection from "./Components/WelcomeSection";


function App() {
  return (
    <div>
     <Navbar/>
     <WelcomeSection/>
     <PopularProducts/>
     <BestSellingProducts/>
     <NewestItems/>
     <Footer/>
    </div>
  );
}

export default App;
