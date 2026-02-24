import Link from 'next/link';
import { 
  Target, 
  Shield, 
  Users, 
  Award, 
  Ship, 
  Truck, 
  Warehouse, 
  Tag,
  Globe,
  Package,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui';

const values = [
  { icon: Target, title: 'Expertise', description: 'Deep industry knowledge and market understanding built over years of successful partnerships.' },
  { icon: Shield, title: 'Transparency', description: 'Open communication and honest dealings form the foundation of all our business relationships.' },
  { icon: Users, title: 'Collaboration', description: 'We believe in building lasting partnerships that create mutual value and growth.' },
  { icon: Award, title: 'Commitment', description: 'Dedicated to delivering excellence in every aspect of our service and operations.' },
];

const services = [
  { icon: Ship, title: 'Import & Export', description: 'Comprehensive international trade services connecting suppliers with markets worldwide. We handle all documentation, customs clearance, and regulatory requirements.' },
  { icon: Truck, title: 'Distribution', description: 'Efficient logistics and distribution networks ensuring timely delivery across regions. Our fleet and partner networks cover major markets globally.' },
  { icon: Warehouse, title: 'Warehousing', description: 'Modern storage facilities with climate control, inventory management systems, and 24/7 security monitoring for your products.' },
  { icon: Tag, title: 'Custom Labeling', description: 'Professional labeling and packaging services to meet regional requirements, including multilingual labels and compliance with local regulations.' },
];

const milestones = [
  { year: '2009', title: 'Company Founded', description: 'Started operations with a focus on premium FMCG distribution' },
  { year: '2012', title: 'International Expansion', description: 'Expanded to 25+ countries across Europe and Middle East' },
  { year: '2016', title: 'Major Partnerships', description: 'Secured partnerships with leading global brands' },
  { year: '2020', title: 'Digital Transformation', description: 'Launched digital ordering platform and enhanced logistics' },
  { year: '2024', title: 'Global Reach', description: 'Now serving 75+ countries with 15,000+ products' },
];

const certifications = [
  'ISO 9001:2015 Quality Management',
  'HACCP Food Safety',
  'BRC Global Standards',
  'FDA Registered Facility',
];

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-white">About Us</h1>
          <p className="mt-4 text-xl text-white/80 max-w-2xl">
            Your trusted partner in global FMCG distribution since 2009
          </p>
        </div>
      </div>

      {/* Company Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
              <p className="text-lg text-secondary-600 mb-4">
                Brands Bridge International is a leading FMCG trading company specializing in the import, export, and distribution of premium consumer goods. With partnerships spanning across continents, we connect world-renowned brands with markets seeking quality products.
              </p>
              <p className="text-lg text-secondary-600 mb-4">
                Our expertise in logistics, regulatory compliance, and market understanding makes us the preferred partner for brands looking to expand their global footprint.
              </p>
              <p className="text-lg text-secondary-600">
                Headquartered in Dubai with offices across Europe and Asia, we serve retailers, wholesalers, and distributors in over 75 countries.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-primary-50 p-6 rounded-xl text-center">
                <Globe className="h-10 w-10 text-primary-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary-600">75+</div>
                <div className="text-secondary-600">Countries Served</div>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl text-center">
                <Package className="h-10 w-10 text-primary-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary-600">15,000+</div>
                <div className="text-secondary-600">Products</div>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl text-center">
                <Award className="h-10 w-10 text-primary-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary-600">200+</div>
                <div className="text-secondary-600">Partner Brands</div>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl text-center">
                <Calendar className="h-10 w-10 text-primary-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary-600">15+</div>
                <div className="text-secondary-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="text-secondary-600 mt-4 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
                <value.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-secondary-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Services</h2>
            <p className="text-secondary-600 mt-4 max-w-2xl mx-auto">
              Comprehensive solutions for your FMCG trading needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="flex gap-4 p-6 bg-white rounded-xl border hover:border-primary-300 hover:shadow-lg transition-all">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                    <service.icon className="h-7 w-7 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-secondary-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-secondary-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Journey</h2>
            <p className="text-secondary-400 mt-4">Key milestones in our growth</p>
          </div>
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-primary-400 font-bold">{milestone.year}</span>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary-500 rounded-full" />
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-secondary-700 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-lg">{milestone.title}</h3>
                  <p className="text-secondary-400 mt-1">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Certifications & Compliance</h2>
            <p className="text-secondary-600 mt-4 max-w-2xl mx-auto">
              We maintain the highest standards in quality and safety
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Partner With Us?</h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Join our network of partners and access premium FMCG brands for your market.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg" className="mt-8 bg-white text-primary-600 hover:bg-gray-100">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
