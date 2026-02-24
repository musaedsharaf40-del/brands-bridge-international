import { PrismaClient, UserRole, InquiryType, ContentType, PartnerType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ==================== CREATE ADMIN USER ====================
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@brandsbridgeintl.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@brandsbridgeintl.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ==================== CREATE CATEGORIES ====================
  const categories = [
    { name: 'Confectionery', nameAr: 'الحلويات', slug: 'confectionery', description: 'Chocolates, candies, and sweet treats from world-renowned brands', icon: 'candy', sortOrder: 1 },
    { name: 'Beverages', nameAr: 'المشروبات', slug: 'beverages', description: 'Soft drinks, juices, energy drinks, and premium water brands', icon: 'cup-soda', sortOrder: 2 },
    { name: 'Coffee & Tea', nameAr: 'القهوة والشاي', slug: 'coffee-tea', description: 'Premium coffee beans, instant coffee, and fine teas', icon: 'coffee', sortOrder: 3 },
    { name: 'Groceries', nameAr: 'البقالة', slug: 'groceries', description: 'Snacks, cereals, pasta, sauces, and everyday food items', icon: 'shopping-basket', sortOrder: 4 },
    { name: 'Household', nameAr: 'المنزلية', slug: 'household', description: 'Cleaning products, personal care, and household essentials', icon: 'home', sortOrder: 5 },
    { name: 'Pet Food', nameAr: 'طعام الحيوانات', slug: 'pet-food', description: 'Quality nutrition for cats, dogs, and other pets', icon: 'paw-print', sortOrder: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Categories created:', categories.length);

  // ==================== CREATE BRANDS ====================
  const brands = [
    // Confectionery Brands
    { name: 'Nestlé', slug: 'nestle', description: 'Global leader in nutrition, health and wellness', country: 'Switzerland', isFeatured: true, sortOrder: 1 },
    { name: 'Mars', slug: 'mars', description: 'World-famous for chocolate bars and confectionery', country: 'USA', isFeatured: true, sortOrder: 2 },
    { name: 'Mondelez', slug: 'mondelez', description: 'Home to iconic snack brands worldwide', country: 'USA', isFeatured: true, sortOrder: 3 },
    { name: 'Ferrero', slug: 'ferrero', description: 'Italian excellence in premium confectionery', country: 'Italy', isFeatured: true, sortOrder: 4 },
    { name: 'Lindt', slug: 'lindt', description: 'Swiss master chocolatiers since 1845', country: 'Switzerland', isFeatured: true, sortOrder: 5 },
    // Beverage Brands
    { name: 'Coca-Cola', slug: 'coca-cola', description: 'The world\'s most recognized beverage brand', country: 'USA', isFeatured: true, sortOrder: 6 },
    { name: 'PepsiCo', slug: 'pepsico', description: 'Global food and beverage leader', country: 'USA', isFeatured: true, sortOrder: 7 },
    { name: 'Red Bull', slug: 'red-bull', description: 'Leading energy drink manufacturer', country: 'Austria', isFeatured: true, sortOrder: 8 },
    // Coffee & Tea
    { name: 'Lavazza', slug: 'lavazza', description: 'Italian coffee tradition since 1895', country: 'Italy', isFeatured: true, sortOrder: 9 },
    { name: 'Starbucks', slug: 'starbucks', description: 'Premium coffee experience worldwide', country: 'USA', isFeatured: true, sortOrder: 10 },
    // Household
    { name: 'Procter & Gamble', slug: 'pg', description: 'Trusted household and personal care products', country: 'USA', isFeatured: true, sortOrder: 11 },
    { name: 'Unilever', slug: 'unilever', description: 'Sustainable living brands', country: 'UK/Netherlands', isFeatured: true, sortOrder: 12 },
    // Pet Food
    { name: 'Purina', slug: 'purina', description: 'Science-based pet nutrition', country: 'USA', isFeatured: false, sortOrder: 13 },
    { name: 'Royal Canin', slug: 'royal-canin', description: 'Precise nutrition for cats and dogs', country: 'France', isFeatured: false, sortOrder: 14 },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
  }
  console.log('✅ Brands created:', brands.length);

  // ==================== CREATE SAMPLE PRODUCTS ====================
  const confectioneryCategory = await prisma.category.findUnique({ where: { slug: 'confectionery' } });
  const beveragesCategory = await prisma.category.findUnique({ where: { slug: 'beverages' } });
  const nestleBrand = await prisma.brand.findUnique({ where: { slug: 'nestle' } });
  const cocaColaBrand = await prisma.brand.findUnique({ where: { slug: 'coca-cola' } });

  const products = [
    { name: 'Kit Kat', slug: 'kit-kat', description: 'Crispy wafer fingers covered in smooth milk chocolate', sku: 'NEST-001', categoryId: confectioneryCategory?.id, brandId: nestleBrand?.id, isFeatured: true, sortOrder: 1 },
    { name: 'After Eight', slug: 'after-eight', description: 'Elegant mint chocolate thins', sku: 'NEST-002', categoryId: confectioneryCategory?.id, brandId: nestleBrand?.id, isFeatured: true, sortOrder: 2 },
    { name: 'Quality Street', slug: 'quality-street', description: 'Assorted chocolates and toffees', sku: 'NEST-003', categoryId: confectioneryCategory?.id, brandId: nestleBrand?.id, isFeatured: false, sortOrder: 3 },
    { name: 'Coca-Cola Classic', slug: 'coca-cola-classic', description: 'The original refreshing cola taste', sku: 'COKE-001', categoryId: beveragesCategory?.id, brandId: cocaColaBrand?.id, isFeatured: true, sortOrder: 4 },
    { name: 'Fanta Orange', slug: 'fanta-orange', description: 'Vibrant orange flavored soft drink', sku: 'COKE-002', categoryId: beveragesCategory?.id, brandId: cocaColaBrand?.id, isFeatured: true, sortOrder: 5 },
    { name: 'Sprite', slug: 'sprite', description: 'Crisp lemon-lime refreshment', sku: 'COKE-003', categoryId: beveragesCategory?.id, brandId: cocaColaBrand?.id, isFeatured: false, sortOrder: 6 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log('✅ Products created:', products.length);

  // ==================== CREATE CONTENT ====================
  const contents = [
    { key: 'hero_title', type: ContentType.TEXT, value: 'Your Gateway to Global Brands', valueAr: 'بوابتك للعلامات التجارية العالمية', section: 'hero' },
    { key: 'hero_subtitle', type: ContentType.TEXT, value: 'Premium FMCG Distribution Across Continents', valueAr: 'توزيع السلع الاستهلاكية عالية الجودة عبر القارات', section: 'hero' },
    { key: 'hero_cta', type: ContentType.TEXT, value: 'Explore Our Products', valueAr: 'استكشف منتجاتنا', section: 'hero' },
    { key: 'about_title', type: ContentType.TEXT, value: 'About Brands Bridge International', valueAr: 'حول براندز بريدج الدولية', section: 'about' },
    { key: 'about_text', type: ContentType.HTML, value: '<p>Brands Bridge International is a leading FMCG trading company specializing in the import, export, and distribution of premium consumer goods. With partnerships spanning across continents, we connect world-renowned brands with markets seeking quality products.</p><p>Our expertise in logistics, regulatory compliance, and market understanding makes us the preferred partner for brands looking to expand their global footprint.</p>', valueAr: '<p>براندز بريدج الدولية هي شركة رائدة في تجارة السلع الاستهلاكية سريعة الدوران متخصصة في استيراد وتصدير وتوزيع السلع الاستهلاكية الفاخرة.</p>', section: 'about' },
    { key: 'contact_title', type: ContentType.TEXT, value: 'Get in Touch', valueAr: 'تواصل معنا', section: 'contact' },
    { key: 'contact_subtitle', type: ContentType.TEXT, value: 'Ready to partner with us? We\'d love to hear from you.', valueAr: 'مستعد للشراكة معنا؟ نحب أن نسمع منك.', section: 'contact' },
  ];

  for (const content of contents) {
    await prisma.content.upsert({
      where: { key: content.key },
      update: content,
      create: content,
    });
  }
  console.log('✅ Content created:', contents.length);

  // ==================== CREATE STATISTICS ====================
  const statistics = [
    { key: 'countries', label: 'Countries Served', labelAr: 'الدول التي نخدمها', value: '75+', icon: 'globe', sortOrder: 1 },
    { key: 'products', label: 'Products Available', labelAr: 'المنتجات المتوفرة', value: '15,000+', icon: 'package', sortOrder: 2 },
    { key: 'brands', label: 'Partner Brands', labelAr: 'العلامات التجارية الشريكة', value: '200+', icon: 'award', sortOrder: 3 },
    { key: 'experience', label: 'Years Experience', labelAr: 'سنوات الخبرة', value: '15+', icon: 'calendar', sortOrder: 4 },
  ];

  for (const stat of statistics) {
    await prisma.statistic.upsert({
      where: { key: stat.key },
      update: stat,
      create: stat,
    });
  }
  console.log('✅ Statistics created:', statistics.length);

  // ==================== CREATE COMPANY VALUES ====================
  const values = [
    { title: 'Expertise', titleAr: 'الخبرة', description: 'Deep industry knowledge and market understanding built over years of successful partnerships.', descriptionAr: 'معرفة عميقة بالصناعة وفهم السوق المبني على سنوات من الشراكات الناجحة.', icon: 'lightbulb', sortOrder: 1 },
    { title: 'Transparency', titleAr: 'الشفافية', description: 'Open communication and honest dealings form the foundation of all our business relationships.', descriptionAr: 'التواصل المفتوح والتعاملات الصادقة تشكل أساس جميع علاقاتنا التجارية.', icon: 'eye', sortOrder: 2 },
    { title: 'Collaboration', titleAr: 'التعاون', description: 'We believe in building lasting partnerships that create mutual value and growth.', descriptionAr: 'نؤمن ببناء شراكات دائمة تخلق قيمة ونمو متبادل.', icon: 'users', sortOrder: 3 },
    { title: 'Commitment', titleAr: 'الالتزام', description: 'Dedicated to delivering excellence in every aspect of our service and operations.', descriptionAr: 'ملتزمون بتقديم التميز في كل جانب من جوانب خدماتنا وعملياتنا.', icon: 'target', sortOrder: 4 },
  ];

  for (const value of values) {
    await prisma.value.upsert({
      where: { id: value.title }, // Use title as unique identifier for upsert
      update: value,
      create: value,
    });
  }
  console.log('✅ Values created:', values.length);

  // ==================== CREATE SERVICES ====================
  const services = [
    { title: 'Import & Export', titleAr: 'الاستيراد والتصدير', description: 'Comprehensive international trade services connecting suppliers with markets worldwide.', descriptionAr: 'خدمات تجارة دولية شاملة تربط الموردين بالأسواق في جميع أنحاء العالم.', icon: 'ship', sortOrder: 1 },
    { title: 'Distribution', titleAr: 'التوزيع', description: 'Efficient logistics and distribution networks ensuring timely delivery across regions.', descriptionAr: 'شبكات لوجستية وتوزيع فعالة تضمن التسليم في الوقت المناسب عبر المناطق.', icon: 'truck', sortOrder: 2 },
    { title: 'Warehousing', titleAr: 'التخزين', description: 'Modern storage facilities with climate control and inventory management systems.', descriptionAr: 'مرافق تخزين حديثة مع التحكم في المناخ وأنظمة إدارة المخزون.', icon: 'warehouse', sortOrder: 3 },
    { title: 'Custom Labeling', titleAr: 'التغليف المخصص', description: 'Professional labeling and packaging services to meet regional requirements.', descriptionAr: 'خدمات التعبئة والتغليف المهنية لتلبية المتطلبات الإقليمية.', icon: 'tag', sortOrder: 4 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.title },
      update: service,
      create: service,
    });
  }
  console.log('✅ Services created:', services.length);

  // ==================== CREATE SETTINGS ====================
  const settings = [
    { key: 'company_name', value: 'Brands Bridge International', type: 'string', group: 'general' },
    { key: 'company_email', value: 'info@brandsbridgeintl.com', type: 'string', group: 'contact' },
    { key: 'company_phone', value: '+1 (555) 123-4567', type: 'string', group: 'contact' },
    { key: 'company_address', value: '123 Trade Center, Business District, Dubai, UAE', type: 'string', group: 'contact' },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/brands-bridge-international', type: 'string', group: 'social' },
    { key: 'social_facebook', value: 'https://facebook.com/brandsbridgeintl', type: 'string', group: 'social' },
    { key: 'social_instagram', value: 'https://instagram.com/brandsbridgeintl', type: 'string', group: 'social' },
    { key: 'meta_title', value: 'Brands Bridge International | Premium FMCG Trading', type: 'string', group: 'seo' },
    { key: 'meta_description', value: 'Brands Bridge International - Your trusted partner in global FMCG distribution. Import, export, and distribution of premium consumer goods worldwide.', type: 'string', group: 'seo' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }
  console.log('✅ Settings created:', settings.length);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
