-- =========================================================================================
-- SUPER SCRIPT SQL: SUNNS EYEWEAR COMPLETE DATABASE SCHEMA & SEED DATA
-- Fully compatible with Supabase & PostgreSQL
-- NO RLS (Row Level Security disabled on all tables for frictionless direct access)
-- NO email confirmation required for user registration
-- Includes: Users/Auth, Categories, Subcategories, Products, Orders, Items, Addresses, Cards, Prescriptions & Coupons
-- =========================================================================================

-- 1. EXTENSIONS & CLEANUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. USERS TABLE (No Email Verification, Immediate Access)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'sunns_pass_123',
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user', -- 'admin' or 'user'
    tier TEXT DEFAULT 'Miembro Club Privé',
    member_since TEXT DEFAULT '2026',
    total_spent NUMERIC(10,2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 100,
    stripe_customer_id TEXT,
    avatar TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBCATEGORIES TABLE
CREATE TABLE subcategories (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS TABLE (Complete Eyewear Catalog)
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT,
    details JSONB DEFAULT '[]'::JSONB,
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::JSONB,
    colors JSONB DEFAULT '[]'::JSONB,
    in_stock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE (Stripe & Historical Checkouts)
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'paid', -- 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
    status_label TEXT NOT NULL DEFAULT 'Pagado',
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
    shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL DEFAULT 0,
    courier TEXT,
    tracking_number TEXT,
    payment_method_type TEXT DEFAULT 'stripe_card',
    payment_method_brand TEXT DEFAULT 'visa',
    payment_method_last4 TEXT DEFAULT '4242',
    stripe_payment_intent_id TEXT,
    stripe_receipt_url TEXT,
    shipping_full_name TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_zip TEXT,
    shipping_country TEXT
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT,
    product_name TEXT NOT NULL,
    product_image TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    color TEXT
);

-- 8. SAVED ADDRESSES TABLE
CREATE TABLE addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    full_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT,
    is_default_shipping BOOLEAN DEFAULT FALSE,
    is_default_billing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SAVED PAYMENT METHODS TABLE
CREATE TABLE payment_methods (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    last4 TEXT NOT NULL,
    exp_month TEXT NOT NULL,
    exp_year TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    stripe_payment_method_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. OPTICAL PRESCRIPTIONS TABLE
CREATE TABLE prescriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sphere_od TEXT,
    sphere_os TEXT,
    cylinder_od TEXT,
    cylinder_os TEXT,
    axis_od TEXT,
    axis_os TEXT,
    pupillary_distance TEXT,
    preferred_lens_treatment TEXT,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. COUPONS & PROMOS TABLE
CREATE TABLE coupons (
    code TEXT PRIMARY KEY,
    discount_percent NUMERIC(5,2) NOT NULL DEFAULT 10,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================================
-- DISABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES AS REQUESTED
-- =========================================================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;

-- GRANT COMPLETE PERMISSIONS TO PUBLIC AND ANON ROLES
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- =========================================================================================
-- SEED INITIAL DATA (ADMIN, CATEGORIES, PRODUCTS, ORDERS, COUPONS)
-- =========================================================================================

-- Seed Users (Super Admin + Demo VIP Client)
INSERT INTO users (id, email, password, name, phone, role, tier, member_since, total_spent, loyalty_points, stripe_customer_id, two_factor_enabled, avatar)
VALUES
(
    'usr_admin_001',
    'admin@sunnsshop.com',
    'admin123',
    'Alexander Rossi',
    '+1 (786) 825-9355',
    'admin',
    'Black Elite',
    'Marzo 2024',
    1240.00,
    12400,
    'cus_sunns_admin_001',
    TRUE,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
),
(
    'usr_vip_002',
    'socio@sunnsshop.com',
    'password123',
    'Valeria Montiel',
    '+1 (305) 555-0199',
    'user',
    'Prestige VIP',
    'Enero 2025',
    630.00,
    6300,
    'cus_sunns_vip_002',
    FALSE,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Categories
INSERT INTO categories (id, name) VALUES
('sol', 'Sol'),
('opticos', 'Ópticos'),
('deportivos', 'Deportivos'),
('vintage', 'Vintage')
ON CONFLICT (id) DO NOTHING;

-- Seed Subcategories
INSERT INTO subcategories (id, category_id, name) VALUES
('sol-aviador', 'sol', 'Aviador'),
('sol-cuadrado', 'sol', 'Cuadrado'),
('sol-elegante', 'sol', 'Elegante'),
('opticos-redondo', 'opticos', 'Redondo'),
('opticos-pantallas', 'opticos', 'Filtro Luz Azul'),
('deportivos-polarizado', 'deportivos', 'Polarizado'),
('deportivos-alto-rendimiento', 'deportivos', 'Alto Rendimiento'),
('vintage-retro', 'vintage', 'Retro 70s'),
('vintage-clasico', 'vintage', 'Clásico Acetato')
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO products (id, name, price, category, subcategory, description, details, image, images, colors, in_stock, featured, rating, reviews_count)
VALUES
(
    'nox-minimal',
    'Nox Minimal',
    185.00,
    'Sol',
    'Elegante',
    'Lentes de sol minimalistas de acetato italiano de alta densidad en tono negro absoluto. Un diseño contemporáneo esculpido a mano para quienes aprecian la sofisticación sin esfuerzo.',
    '["Protección 100% UVA/UVB (Filtro UV400)", "Acetato pulido a mano de origen orgánico mazzucchelli", "Bisagras alemanas de 5 barriles de alta durabilidad", "Lentes polarizados de nailon de máxima nitidez óptica", "Estuche de cuero marrón Sunns y paño de microfibra"]'::JSONB,
    '/src/assets/images/glasses_sun_minimal_1787327499742.jpg',
    '["/src/assets/images/glasses_sun_minimal_1787327499742.jpg", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600"]'::JSONB,
    '[{"name": "Negro Carbón", "value": "#1A1A1A"}, {"name": "Humo Translúcido", "value": "#4E5154"}, {"name": "Miel Calma", "value": "#C68E5A"}]'::JSONB,
    TRUE,
    TRUE,
    4.90,
    38
),
(
    'aurelia-vintage',
    'Aurelia Vintage',
    210.00,
    'Vintage',
    'Retro 70s',
    'Lentes de sol retro de inspiración setentera con montura metálica dorada y lentes oscuros de alta definición. El equilibrio perfecto entre nostalgia sofisticada y elegancia moderna.',
    '["Protección 100% UVA/UVB (UV400)", "Estructura metálica de acero inoxidable con baño de oro de 18k sutil", "Plaquetas nasales de silicona hipoalergénicas y ajustables", "Lentes CR-39 con recubrimiento antirreflejante interno", "Estuche rígido de piel Sunns premium incluido"]'::JSONB,
    '/src/assets/images/glasses_sun_vintage_1787327472556.jpg',
    '["/src/assets/images/glasses_sun_vintage_1787327472556.jpg", "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600"]'::JSONB,
    '[{"name": "Oro Pulido / Negro", "value": "#D4AF37"}, {"name": "Plata Noble / Azul", "value": "#C0C0C0"}, {"name": "Bronce Antiguo", "value": "#CD7F32"}]'::JSONB,
    TRUE,
    TRUE,
    4.80,
    24
),
(
    'lumiere-classic',
    'Lumière Classic',
    165.00,
    'Ópticos',
    'Redondo',
    'Gafas ópticas circulares elegantes con montura de acetato translúcido en tono champaña cálido. Comodidad excepcional de peso pluma y estilo intelectual contemporáneo.',
    '["Diseñado para cristales recetados de alta precisión", "Montura de acetato ultraligero y flexible de primera calidad", "Varillas reforzadas con alma de metal grabado para ajuste óptimo", "Filtro de luz azul sutil preinstalado para pantallas", "Incluye certificado de autenticidad y estuche protector"]'::JSONB,
    '/src/assets/images/glasses_optical_classic_1787327485566.jpg',
    '["/src/assets/images/glasses_optical_classic_1787327485566.jpg", "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=600"]'::JSONB,
    '[{"name": "Champaña Translúcido", "value": "#EEDC82"}, {"name": "Cristal Claro", "value": "#F0F8FF"}, {"name": "Carey Ámbar", "value": "#704214"}]'::JSONB,
    TRUE,
    TRUE,
    4.70,
    42
),
(
    'zephyr-active',
    'Zephyr Active',
    195.00,
    'Deportivos',
    'Polarizado',
    'Lentes deportivos envolventes y aerodinámicos de polímero ultraligero TR90. Diseñados para rendimiento extremo, running, ciclismo y actividades náuticas de alto impacto.',
    '["Lentes hidrofóbicos y oleofóbicos que repelen agua y sudor", "Estructura envolvente de polímero TR90 ultrarresistente", "Grip de goma antideslizante en puente nasal y patillas", "Protección 100% UV400 categoría 3 para luz solar intensa", "Incluye estuche deportivo rígido con mosquetón"]'::JSONB,
    '/src/assets/images/glasses_sport_active_1787327513076.jpg',
    '["/src/assets/images/glasses_sport_active_1787327513076.jpg", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600"]'::JSONB,
    '[{"name": "Grafito Mate / Espejo", "value": "#2E3138"}, {"name": "Blanco Nieve / Zafiro", "value": "#F8F9FA"}, {"name": "Negro / Rojo Fuego", "value": "#B22222"}]'::JSONB,
    TRUE,
    TRUE,
    4.95,
    56
)
ON CONFLICT (id) DO NOTHING;

-- Seed Demo Orders
INSERT INTO orders (
    id, user_id, order_number, date, created_at, status, status_label, 
    subtotal, shipping, discount, total, courier, tracking_number, 
    payment_method_type, payment_method_brand, payment_method_last4, 
    stripe_payment_intent_id, stripe_receipt_url, 
    shipping_full_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country
) VALUES
(
    'ord_sunns_984102',
    'usr_admin_001',
    'SN-2026-9841',
    '12 de Mayo, 2026',
    '2026-05-12T14:32:00Z',
    'delivered',
    'Entregado',
    185.00, 0, 0, 185.00,
    'DHL Express Worldwide',
    'DHL-8492019482',
    'stripe_card', 'visa', '4242',
    'pi_3MtwL2LkdIwHu7ix0H2y7z8u',
    'https://stripe.com/receipts/acct_123/pi_3MtwL2LkdIwHu7ix0H2y7z8u',
    'Alexander Rossi',
    '801 Brickell Bay Dr, Suite 1400',
    'Miami', 'FL', '33131', 'Estados Unidos'
),
(
    'ord_sunns_772109',
    'usr_vip_002',
    'SN-2026-7721',
    '28 de Junio, 2026',
    '2026-06-28T18:15:00Z',
    'shipped',
    'Enviado',
    210.00, 0, 21.00, 189.00,
    'FedEx Priority',
    'FDX-993810231',
    'stripe_card', 'amex', '0005',
    'pi_3NuqM8LkdIwHu7ix9H2y1b1a',
    NULL,
    'Valeria Montiel',
    '1100 Ocean Drive, Apt 4B',
    'Miami Beach', 'FL', '33139', 'Estados Unidos'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Order Items
INSERT INTO order_items (id, order_id, product_id, product_name, product_image, quantity, unit_price, color) VALUES
('item_984102_1', 'ord_sunns_984102', 'nox-minimal', 'Nox Minimal', '/src/assets/images/glasses_sun_minimal_1787327499742.jpg', 1, 185.00, 'Negro Carbón'),
('item_772109_1', 'ord_sunns_772109', 'aurelia-vintage', 'Aurelia Vintage', '/src/assets/images/glasses_sun_vintage_1787327472556.jpg', 1, 210.00, 'Oro Pulido / Negro')
ON CONFLICT (id) DO NOTHING;

-- Seed Coupons
INSERT INTO coupons (code, discount_percent, description, is_active) VALUES
('WELCOME10', 10.00, '10% OFF Cupón de Bienvenida Club Privé', TRUE),
('SUNNSVIP', 15.00, '15% OFF Exclusivo Socios VIP', TRUE),
('SUMMER20', 20.00, '20% OFF Descuento Especial de Temporada', TRUE)
ON CONFLICT (code) DO NOTHING;
