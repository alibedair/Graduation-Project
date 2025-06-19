
import BestSellingProducts from "../Components/BestSellingProducts";
import Footer from "../Components/Footer";
import NewestItems from "../Components/NewestItems";
import PopularProducts from "../Components/PopularProducts";
import WelcomeSection from "../Components/WelcomeSection";

function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      <WelcomeSection />
      <PopularProducts />
      <BestSellingProducts />
      <NewestItems />
      <Footer />
    </div>
  );
}

export default LandingPage;
