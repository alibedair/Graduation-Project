import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative gradient-bg py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
                Discover
                <span className="block text-coral">Handmade</span>
                Treasures
              </h1>
              <p className="text-lg text-black/80 mb-8 max-w-lg">
                Connect with talented artisans and find unique, handcrafted pieces that tell a story.
                Support local artists and bring authentic craftsmanship into your home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/shop')}
                className="bg-coral hover:bg-coral/80 text-cream px-8 py-3 text-lg font-medium rounded-md transition-colors duration-200 cursor-pointer"
              >
                Shop Now
              </button>
              <button
                className="border border-burgundy text-burgundy hover:bg-burgundy hover:text-cream px-8 py-3 text-lg font-medium rounded-md transition-colors duration-200 cursor-pointer"
              >
                Explore Artisans
              </button>
            </div>
            {/* 
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-burgundy">10,000+</div>
                <div className="text-sm text-burgundy/70">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-burgundy">500+</div>
                <div className="text-sm text-burgundy/70">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-burgundy">50+</div>
                <div className="text-sm text-burgundy/70">Categories</div>
              </div>
            </div> */}
          </div>

          <div className="relative animate-scale-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://plus.unsplash.com/premium_photo-1677621683737-3e92745fc7a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFuZG1hZGV8ZW58MHx8MHx8fDA%3D"
                  alt="Handmade pottery"
                  className="rounded-lg shadow-lg hover-scale"
                />
                <img
                  src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Artisan jewelry"
                  className="rounded-lg shadow-lg hover-scale"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1609881583302-61548332039c?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Handwoven textiles"
                  className="rounded-lg shadow-lg hover-scale"
                />
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
                  alt="Wood crafts"
                  className="rounded-lg shadow-lg hover-scale"
                />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-coral/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-burgundy/20 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
