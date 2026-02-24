import Link from 'next/link';
import { 
  Globe, 
  Package, 
  Award, 
  Calendar, 
  ArrowRight, 
  Truck, 
  Shield, 
  Users, 
  Target,
  Ship,
  Warehouse,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui';

// Static data for the homepage (in production, fetch from API)
const statistics = [
  { icon: Globe, label: 'Countries Served', value: '75+' },
  { icon: Package, label: 'Products Available', value: '15,000+' },
  { icon: Award, label: 'Partner Brands', value: '200+' },
  { icon: Calendar, label: 'Years Experience', value: '15+' },
];

const categories = [
  { name: 'Confectionery', slug: 'confectionery', description: 'Premium chocolates and sweets', icon: '🍫' },
  { name: 'Beverages', slug: 'beverages', description: 'Soft drinks and juices', icon: '🥤' },
  { name: 'Coffee & Tea', slug: 'coffee-tea', description: 'Premium coffee and teas', icon: '☕' },
  { name: 'Groceries', slug: 'groceries', description: 'Snacks and food items', icon: '🛒' },
  { name: 'Household', slug: 'household', description: 'Cleaning and personal care', icon: '🧴' },
  { name: 'Pet Food', slug: 'pet-food', description: 'Quality pet nutrition', icon: '🐕' },
];

const featuredBrands = [
  'Nestlé', 'Mars', 'Mondelez', 'Ferrero', 'Coca-Cola', 'PepsiCo', 
  'Unilever', 'P&G', 'Red Bull', 'Lavazza', 'Lindt', 'Starbucks'
];

const values = [
  { icon: Target, title: 'Expertise', description: 'Deep industry knowledge and market understanding built over years of successful partnerships.' },
  { icon: Shield, title: 'Transparency', description: 'Open communication and honest dealings form the foundation of all our business relationships.' },
  { icon: Users, title: 'Collaboration', description: 'We believe in building lasting partnerships that create mutual value and growth.' },
  { icon: Award, title: 'Commitment', description: 'Dedicated to delivering excellence in every aspect of our service and operations.' },
];

const services = [
  { icon: Ship, title: 'Import & Export', description: 'Comprehensive international trade services connecting suppliers with markets worldwide.' },
  { icon: Truck, title: 'Distribution', description: 'Efficient logistics and distribution networks ensuring timely delivery across regions.' },
  { icon: Warehouse, title: 'Warehousing', description: 'Modern storage facilities with climate control and inventory management systems.' },
  { icon: Tag, title: 'Custom Labeling', description: 'Professional labeling and packaging services to meet regional requirements.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="container-custom relative z-10 py-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Gateway to
              <span className="block text-primary-300">Global Brands</span>
            </h1>
            <p className="mt-6 text-xl text-white/80 max-w-2xl">
              Premium FMCG distribution across continents. Connecting world-renowned brands with markets seeking quality products.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/products">
                <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Partner With Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white -mt-20 relative z-20">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="h-10 w-10 mx-auto text-primary-600 mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-secondary-900">{stat.value}</div>
                  <div className="text-secondary-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">About Brands Bridge International</h2>
              <p className="mt-6 text-lg text-secondary-600">
                Brands Bridge International is a leading FMCG trading company specializing in the import, export, and distribution of premium consumer goods. With partnerships spanning across continents, we connect world-renowned brands with markets seeking quality products.
              </p>
              <p className="mt-4 text-lg text-secondary-600">
                Our expertise in logistics, regulatory compliance, and market understanding makes us the preferred partner for brands looking to expand their global footprint.
              </p>
              <Link href="/about">
                <Button variant="primary" className="mt-8">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <value.icon className="h-8 w-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-secondary-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Product Categories</h2>
            <p className="section-subtitle mx-auto mt-4">
              Explore our wide range of FMCG products across various categories
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-lg transition-all">
                  <span className="text-4xl">{category.icon}</span>
                  <h3 className="font-semibold text-lg mt-4 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-secondary-600 mt-2">{category.description}</p>
                  <div className="mt-4 text-primary-600 font-medium flex items-center">
                    View Products
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="section-padding bg-secondary-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Partner Brands</h2>
            <p className="text-secondary-400 mt-4 max-w-2xl mx-auto">
              We proudly partner with world-renowned brands to bring quality products to markets worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {featuredBrands.map((brand, index) => (
              <div
                key={index}
                className="bg-secondary-800 rounded-lg p-6 flex items-center justify-center hover:bg-secondary-700 transition-colors"
              >
                <span className="font-semibold text-white/90">{brand}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/brands">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                View All Brands
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle mx-auto mt-4">
              Comprehensive solutions for your FMCG trading needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-secondary-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Partner With Us?
          </h2>
          <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
            Let's discuss how we can help you access premium FMCG brands and expand your market reach.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Contact Us Today
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Browse Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
