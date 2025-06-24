import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaUser,
  FaPaintBrush,
  FaBoxOpen,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [overview, setOverview] = useState({
    customers: 0,
    artists: 0,
    products: 0,
  });
  const [popularProducts, setPopularProducts] = useState([]);
  const [overviewFilter, setOverviewFilter] = useState("All Time");
  const [salesFilter, setSalesFilter] = useState("All Time");

  const [overviewDropdownVisible, setOverviewDropdownVisible] = useState(false);
  const [salesDropdownVisible, setSalesDropdownVisible] = useState(false);

  const overviewDropdownRef = useRef(null);
  const salesDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        overviewDropdownRef.current &&
        !overviewDropdownRef.current.contains(event.target)
      ) {
        setOverviewDropdownVisible(false);
      }
      if (
        salesDropdownRef.current &&
        !salesDropdownRef.current.contains(event.target)
      ) {
        setSalesDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { totalArtists, totalCustomers, totalProducts } = response.data.stats;

        setOverview({
          customers: totalCustomers.toLocaleString(),
          artists: totalArtists.toLocaleString(),
          products: totalProducts.toLocaleString(),
        });
      } catch (error) {
        console.error("Error fetching dashboard overview:", error);
      }
    };

    fetchOverviewData();
  }, [overviewFilter]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/carts");
        const carts = response.data.carts;
        const totalSales = carts.reduce((sum, cart) => sum + cart.total, 0);

        const bands = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000];
        const monthlySales = Array(12)
          .fill(0)
          .map(() => bands[Math.floor(Math.random() * bands.length)]);

        const totalGenerated = monthlySales.reduce((a, b) => a + b, 0);
        const ratio = totalSales / totalGenerated;

        const adjustedMonthlySales = monthlySales.map(sale =>
          Math.round(sale * ratio)
        );

        const formatted = adjustedMonthlySales.map((sales, index) => ({
          month: new Date(0, index).toLocaleString("default", { month: "short" }),
          sales,
        }));

        setSalesData(formatted);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [salesFilter]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products?limit=10");
        const products = response.data;

        const formattedProducts = products.map((product) => ({
          title: product.title,
          image: product.image,
          price: product.price,
        }));

        setPopularProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };

    fetchPopularProducts();
  }, []);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % popularProducts.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + popularProducts.length) % popularProducts.length);
  };

  const visibleProduct = popularProducts[startIndex];

  return (
    <div className="flex flex-col pl-6 w-full bg-[#FAF9F6] mt-5">
      <h2 className="text-2xl font-semibold mt-6">Dashboard</h2>

      {/* Overview Section */}
      <div className="bg-[#F6EEEE] w-4/5 p-6 mt-2 rounded-2xl border border-black">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Overview</h2>
          <div className="relative inline-block text-left" ref={overviewDropdownRef}>
            <button
              onClick={() => setOverviewDropdownVisible(prev => !prev)}
              className="bg-[#E07385] text-white px-4 py-1 rounded-md"
            >
              {overviewFilter} ▼
            </button>
            {overviewDropdownVisible && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                {["Today", "This Week", "This Month", "This Year", "All Time"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setOverviewFilter(option);
                      setOverviewDropdownVisible(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-[#FDECEC] ${
                      option === overviewFilter ? "bg-[#F6EEEE] font-medium" : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-3 border rounded-lg p-4 bg-white">
          <div className="flex flex-col items-center justify-center">
            <FaUser className="text-[#E07385] text-2xl mb-1" />
            <h3 className="text-sm text-gray-600">Customers</h3>
            <p className="text-lg font-bold">{overview.customers}</p>
          </div>
          <div className="flex flex-col items-center justify-center border-x px-4">
            <FaPaintBrush className="text-[#E07385] text-2xl mb-1" />
            <h3 className="text-sm text-gray-600">Artists</h3>
            <p className="text-lg font-bold">{overview.artists}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <FaBoxOpen className="text-[#E07385] text-2xl mb-1" />
            <h3 className="text-sm text-gray-600">Products</h3>
            <p className="text-lg font-bold">{overview.products}</p>
          </div>
        </div>
      </div>

      {/* Sales and Popular Products Section */}
      <div className="flex w-4/5 gap-4 mt-4">
        {/* Sales */}
        <div className="flex-1 bg-[#F6EEEE] p-6 rounded-2xl border border-black">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Summary Sales</h2>
            <div className="relative inline-block text-left" ref={salesDropdownRef}>
              <button
                onClick={() => setSalesDropdownVisible(prev => !prev)}
                className="bg-[#E07385] text-white px-4 py-1 rounded-md"
              >
                {salesFilter} ▼
              </button>
              {salesDropdownVisible && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                  {["Today", "This Week", "This Month", "This Year", "All Time"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSalesFilter(option);
                        setSalesDropdownVisible(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-[#FDECEC] ${
                        option === salesFilter ? "bg-[#F6EEEE] font-medium" : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value}`} />
              <Tooltip formatter={(value) => `${value}`} />
              <Bar dataKey="sales" fill="#E07385" barSize={25} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Products */}
        <div className="w-64 bg-[#F6EEEE] border border-black rounded-2xl p-4 flex flex-col items-center justify-between">
          <div className="flex justify-between w-full mb-3">
            <button onClick={handlePrev} className="text-[#E07385]">
              <FaChevronLeft />
            </button>
            <h3 className="font-semibold text-sm text-gray-800">Popular Products</h3>
            <button onClick={handleNext} className="text-[#E07385]">
              <FaChevronRight />
            </button>
          </div>
          {visibleProduct && (
            <>
              <div className="bg-white rounded-xl shadow-md p-2 w-32 h-32 flex items-center justify-center">
                <img
                  src={visibleProduct.image}
                  alt={visibleProduct.title}
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <p className="text-xs mt-2 text-center font-medium line-clamp-2 px-1">{visibleProduct.title}</p>
              <p className="text-sm font-semibold text-[#E07385] mt-1">${visibleProduct.price}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
