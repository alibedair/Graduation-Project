import { useEffect, useState } from "react";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [expandedProductId, setExpandedProductId] = useState(null);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setProductError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/product/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products.");
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProductError(err.message || "Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleUpdateProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3000/product/update/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Update failed");
      }

      alert("Product updated successfully");
      setEditingProductId(null);
      setExpandedProductId(null);
      fetchProducts();
    } catch (err) {
      console.error("Update error:", err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleProductExpansion = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
      setEditingProductId(null);
    } else {
      setExpandedProductId(productId);
    }
  };

  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">

      {loadingProducts ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-coral)]"></div>
        </div>
      ) : productError ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded max-w-3xl mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{productError}</p>
            </div>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-sm text-gray-500">Add some products to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div
              key={product.productId}
              className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                expandedProductId === product.productId ? "col-span-2 row-span-2" : "cursor-pointer"
              }`}
            >
              <div 
                className="relative w-full aspect-square overflow-hidden bg-gray-100"
                onClick={() => !editingProductId && toggleProductExpansion(product.productId)}
              >
                {product.image?.[0] ? (
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              {expandedProductId === product.productId && (
                <div className="p-5">
                  {editingProductId === product.productId ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateProduct(product.productId);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={updatedData.name || ''}
                          onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:border-[var(--color-coral)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={updatedData.description || ''}
                          onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:border-[var(--color-coral)]"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                          <input
                            type="number"
                            value={updatedData.price || ''}
                            onChange={(e) => setUpdatedData({ ...updatedData, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:border-[var(--color-coral)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <input
                            type="number"
                            value={updatedData.quantity || ''}
                            onChange={(e) => setUpdatedData({ ...updatedData, quantity: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:border-[var(--color-coral)]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                        <input
                          type="text"
                          value={updatedData.material || ''}
                          onChange={(e) => setUpdatedData({ ...updatedData, material: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:border-[var(--color-coral)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                        <input
                          type="text"
                          value={updatedData.dimensions || ''}
                          onChange={(e) => setUpdatedData({ ...updatedData, dimensions: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:border-[var(--color-coral)]"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-coral)]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-coral)] hover:bg-[var(--color-burgundy)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-coral)]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="mt-4">
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        <p className="text-lg font-semibold text-[var(--color-coral)] mt-1">${product.price}</p>
                        <p className="text-sm text-gray-600 mt-3">{product.description}</p>
                        
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>Quantity: {product.quantity}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                            <span>Material: {product.material}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            <span>Dimensions: {product.dimensions}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <button
                          onClick={() => toggleProductExpansion(product.productId)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            setEditingProductId(product.productId);
                            setUpdatedData({
                              name: product.name,
                              description: product.description,
                              price: product.price,
                              quantity: product.quantity,
                              material: product.material,
                              dimensions: product.dimensions,
                            });
                          }}
                          className="px-4 py-2 bg-[var(--color-coral)] text-white rounded-md text-sm font-medium hover:bg-[var(--color-burgundy)]"
                        >
                          Update
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;