import { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
    sales: 0,
  });
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const usersResponse = await axios.get("https://dummyjson.com/users");
        const totalCustomers = (usersResponse.data.total).toLocaleString();
        const totalArtists = Math.floor(usersResponse.data.total).toLocaleString();

        const salesResponse = await axios.get("https://dummyjson.com/carts");
        const totalSales = salesResponse.data.carts.reduce(
          (sum, cart) => sum + cart.total,
          0
        );

        setOverview({
          customers: totalCustomers,
          artists: totalArtists,
          sales: totalSales,
        });
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    fetchOverviewData();
  }, []);

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
  }, []);

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

  const getVisibleProducts = () => {
    return [...popularProducts, ...popularProducts].slice(startIndex, startIndex + 4);
  };

  return (
    <div className="flex flex-col ml-6 w-full bg-[#FAF9F6]">
      <h2 className="text-2xl font-semibold mt-6">Dashboard</h2>

      <div className="bg-[#F6EEEE] w-4/5 p-6 mt-2 rounded-2xl border border-black">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Overview</h2>
          <button className="bg-[#E07385] text-white px-4 py-1 rounded-md">All Time ▼</button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-3 border rounded-lg p-4 bg-[#ffffff]">
          <div className="text-center">
            <h3 className="text-sm text-gray-600">Customers</h3>
            <p className="text-lg font-bold">{overview.customers}</p>
          </div>
          <div className="text-center border-x px-4">
            <h3 className="text-sm text-gray-600">Artists</h3>
            <p className="text-lg font-bold">{overview.artists}</p>
          </div>
          <div className="text-center">
            <h3 className="text-sm text-gray-600">Sales</h3>
            <p className="text-lg font-bold">${overview.sales.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-semibold mb-3">Popular Products</h3>
          <div className="relative flex items-center">
            <button className="absolute left-0 bg-white p-2 rounded-full shadow-md" onClick={handlePrev}>
              <FaChevronLeft />
            </button>

            <div className="flex gap-4 overflow-hidden w-full px-10">
              {getVisibleProducts().map((product, index) => (
                <ProductCard key={index} title={product.title} image={product.image} />
              ))}
            </div>

            <button className="absolute right-0 bg-white p-2 rounded-full shadow-md" onClick={handleNext}>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#F6EEEE] w-3/5 p-6 mt-4 rounded-2xl border border-black h-60">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Summary Sales</h2>
          <button className="bg-[#E07385] text-white px-4 py-1 rounded-md">All Time ▼</button>
        </div>

        <div className="flex justify-center mt-2">
          <ResponsiveContainer width="90%" height={170}>
            <BarChart data={salesData} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value}`} />
              <Tooltip formatter={(value) => `${value}`} />
              <Bar
                dataKey="sales"
                fill="#E07385"
                barSize={25}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ title, image }) => (
  <div className="bg-white border p-2 rounded-lg shadow-sm w-48 h-28 flex flex-col items-center">
    <div className="w-full h-15">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-contain rounded-md"
      />
    </div>
    <p className="text-xs mt-1 text-center leading-tight line-clamp-2">{title}</p>
  </div>
);


export default AdminDashboard;
