const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 px-6 mt-6">
   <div
  className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  style={{ gap: '6rem 8rem' }} 
>      
<div className="space-y-4 -ml-50">
          <h3 className="text-xl font-bold text-[#E07385]">Exclusive</h3>
          <p className="text-base font-semibold text-white">Subscribe</p>
          <p className="text-xs text-white">Get 10% off your first order</p>
          <div className="flex border border-gray-500 rounded-md overflow-hidden w-3/4 max-w-xs">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-1 text-white bg-black text-sm focus:outline-none"
            />
            <button className="bg-[#E07385] px-3 py-1 hover:bg-[#7a162e] transition text-sm">
              &#10148;
            </button>
          </div>
        </div>

        <div className="space-y-4 mr-[-50px]">
          <h4 className="text-base font-bold text-[#E07385]">Support</h4>
          <p className="text-xs text-white">Craftopia@gmail.com</p>
          <p className="text-xs text-white">+88015-88888-9999</p>
        </div>

        <div className="space-y-4 ml-[100px]">
          <h4 className="text-base font-bold text-[#E07385]">Account</h4>
          <ul className="space-y-2 text-xs text-white">
            {["My Account", "Login / Register", "Cart", "Wishlist", "Shop"].map(
              (item) => (
                <li
                  key={item}
                  className="hover:text-[#E07385] transition cursor-pointer"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="space-y-4 ml-[120px]">
  <h4 className="text-base font-bold text-[#E07385]">Quick Links</h4>
          <ul className="space-y-2 text-xs text-white">
            {["Privacy Policy", "Terms of Use", "FAQ", "Contact"].map(
              (item) => (
                <li
                  key={item}
                  className="hover:text-[#E07385] transition cursor-pointer"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <div className="text-center text-white mt-10 text-[10px]">
        © Copyright Craftopia 2025. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
