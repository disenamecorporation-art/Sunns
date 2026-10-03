/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Category, User, Order, SavedAddress, SavedPaymentMethod, OpticalPrescription, HomeContent } from '../types';
import { PRODUCTS as SEED_PRODUCTS } from '../data/products';
import { DEFAULT_CATEGORIES as SEED_CATEGORIES } from '../data/categories';
import { DEFAULT_HOME_CONTENT } from '../data/homeContent';

// ==========================================
// IN-MEMORY RUNTIME CACHE (No LocalStorage)
// Used when DB connection is pending or for instant reactive renders
// ==========================================
let memUsers: (User & { password?: string })[] = [
  {
    id: 'usr_admin_sunns_owner',
    email: 'sunnsshop@icloud.com',
    password: 'admin123',
    name: 'Sunns Administrator',
    phone: '+1 (786) 825-9355',
    role: 'admin',
    tier: 'Super Admin',
    memberSince: '2026',
    totalSpent: 0,
    loyaltyPoints: 50000,
    stripeCustomerId: 'cus_sunns_owner',
    twoFactorEnabled: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    addresses: [],
    paymentMethods: [],
  },
  {
    id: 'usr_admin_001',
    email: 'admin@sunnsshop.com',
    password: 'admin123',
    name: 'Alexander Rossi',
    phone: '+1 (786) 825-9355',
    role: 'admin',
    tier: 'Black Elite',
    memberSince: 'Marzo 2024',
    totalSpent: 1240,
    loyaltyPoints: 12400,
    stripeCustomerId: 'cus_sunns_admin_001',
    twoFactorEnabled: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    addresses: [
      {
        id: 'addr_001',
        title: 'Boutique Principal',
        fullName: 'Alexander Rossi',
        address: '801 Brickell Bay Dr, Suite 1400',
        city: 'Miami',
        state: 'FL',
        zip: '33131',
        country: 'Estados Unidos',
        phone: '+1 (786) 825-9355',
        isDefaultShipping: true,
        isDefaultBilling: true,
      }
    ],
    paymentMethods: [
      {
        id: 'pm_001',
        brand: 'visa',
        last4: '4242',
        expMonth: '12',
        expYear: '2028',
        holderName: 'ALEXANDER ROSSI',
        isDefault: true,
        stripePaymentMethodId: 'pm_stripe_mock_4242',
      }
    ],
    prescription: {
      sphereOD: '-1.25',
      sphereOS: '-1.00',
      cylinderOD: '-0.50',
      cylinderOS: '-0.25',
      axisOD: '90',
      axisOS: '85',
      pupillaryDistance: '63',
      preferredLensTreatment: 'polarizado',
      notes: 'Lentes polarizados con filtro antirreflejo interno para conducción y navegación marina.',
    }
  },
  {
    id: 'usr_vip_002',
    email: 'socio@sunnsshop.com',
    password: 'password123',
    name: 'Valeria Montiel',
    phone: '+1 (305) 555-0199',
    role: 'user',
    tier: 'Prestige VIP',
    memberSince: 'Enero 2025',
    totalSpent: 630,
    loyaltyPoints: 6300,
    stripeCustomerId: 'cus_sunns_vip_002',
    twoFactorEnabled: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    addresses: [
      {
        id: 'addr_002',
        title: 'Residencia Miami Beach',
        fullName: 'Valeria Montiel',
        address: '1100 Ocean Drive, Apt 4B',
        city: 'Miami Beach',
        state: 'FL',
        zip: '33139',
        country: 'Estados Unidos',
        phone: '+1 (305) 555-0199',
        isDefaultShipping: true,
        isDefaultBilling: true,
      }
    ],
    paymentMethods: [
      {
        id: 'pm_002',
        brand: 'amex',
        last4: '0005',
        expMonth: '09',
        expYear: '2027',
        holderName: 'VALERIA MONTIEL',
        isDefault: true,
        stripePaymentMethodId: 'pm_stripe_mock_amex_0005',
      }
    ],
    prescription: {
      sphereOD: '+0.75',
      sphereOS: '+0.75',
      pupillaryDistance: '62',
      preferredLensTreatment: 'blue_light',
      notes: 'Tratamiento con bloqueo de luz azul HD y filtro UV400 completo.',
    }
  }
];

let memProducts: Product[] = [...SEED_PRODUCTS];
let memCategories: Category[] = [...SEED_CATEGORIES];
let memOrders: Record<string, Order[]> = {
  'usr_admin_001': [
    {
      id: 'ord_sunns_984102',
      orderNumber: 'SN-2026-9841',
      date: '12 de Mayo, 2026',
      createdAt: '2026-05-12T14:32:00Z',
      status: 'delivered',
      statusLabel: 'Entregado',
      paymentMethod: {
        type: 'stripe_card',
        brand: 'visa',
        last4: '4242',
        stripePaymentIntentId: 'pi_3MtwL2LkdIwHu7ix0H2y7z8u',
        stripeReceiptUrl: 'https://stripe.com/receipts/acct_123/pi_3MtwL2LkdIwHu7ix0H2y7z8u',
      },
      shippingAddress: {
        fullName: 'Alexander Rossi',
        address: '801 Brickell Bay Dr, Suite 1400',
        city: 'Miami',
        state: 'FL',
        zip: '33131',
        country: 'Estados Unidos',
        phone: '+1 (305) 555-0199',
      },
      items: [
        {
          productId: 'nox-minimal',
          productName: 'Nox Minimal',
          productImage: '/src/assets/images/glasses_sun_minimal_1787327499742.jpg',
          category: 'Sol',
          colorName: 'Negro Carbón',
          colorValue: '#1A1A1A',
          quantity: 1,
          unitPrice: 185,
          totalPrice: 185,
        }
      ],
      subtotal: 185,
      shippingCost: 0,
      discount: 0,
      tax: 0,
      total: 185,
      courier: 'DHL Express Worldwide',
      trackingNumber: 'DHL-8492019482',
    }
  ],
  'usr_vip_002': [
    {
      id: 'ord_sunns_772109',
      orderNumber: 'SN-2026-7721',
      date: '28 de Junio, 2026',
      createdAt: '2026-06-28T18:15:00Z',
      status: 'shipped',
      statusLabel: 'Enviado',
      paymentMethod: {
        type: 'stripe_card',
        brand: 'amex',
        last4: '0005',
        stripePaymentIntentId: 'pi_3NuqM8LkdIwHu7ix9H2y1b1a',
      },
      shippingAddress: {
        fullName: 'Valeria Montiel',
        address: '1100 Ocean Drive, Apt 4B',
        city: 'Miami Beach',
        state: 'FL',
        zip: '33139',
        country: 'Estados Unidos',
        phone: '+1 (305) 555-0188',
      },
      items: [
        {
          productId: 'aurelia-vintage',
          productName: 'Aurelia Vintage',
          productImage: '/src/assets/images/glasses_sun_vintage_1787327472556.jpg',
          category: 'Sol',
          colorName: 'Oro Pulido / Negro',
          colorValue: '#D4AF37',
          quantity: 1,
          unitPrice: 210,
          totalPrice: 210,
        }
      ],
      subtotal: 210,
      shippingCost: 0,
      discount: 21,
      tax: 0,
      total: 189,
      courier: 'FedEx Priority',
      trackingNumber: 'FDX-993810231',
    }
  ]
};

let memActiveUser: User | null = null;

export interface AdminOrderEntry {
  userId: string;
  userEmail: string;
  userName: string;
  order: Order;
}

// ==========================================
// 1. PRODUCTS DATABASE OPERATIONS
// ==========================================

export async function dbGetProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        memProducts = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          price: Number(row.price),
          category: row.category,
          subcategory: row.subcategory || undefined,
          description: row.description || '',
          details: Array.isArray(row.details) ? row.details : (row.details ? JSON.parse(row.details) : []),
          image: row.image,
          images: Array.isArray(row.images) ? row.images : (row.images ? JSON.parse(row.images) : [row.image]),
          colors: Array.isArray(row.colors) ? row.colors : (row.colors ? JSON.parse(row.colors) : []),
          inStock: Boolean(row.in_stock ?? row.inStock ?? true),
          featured: Boolean(row.featured ?? false),
          rating: Number(row.rating || 5.0),
          reviewsCount: Number(row.reviews_count || row.reviewsCount || 0),
        }));
        return memProducts;
      }
    } catch (err) {
      console.warn('DB Products fetch fallback to memory:', err);
    }
  }
  return [...memProducts];
}

export async function dbSaveProduct(product: Product): Promise<Product> {
  const existingIndex = memProducts.findIndex(p => p.id === product.id);
  if (existingIndex >= 0) {
    memProducts[existingIndex] = { ...product };
  } else {
    memProducts.unshift({ ...product });
  }

  if (isSupabaseConfigured()) {
    try {
      const row = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory || null,
        description: product.description,
        details: product.details,
        image: product.image,
        images: product.images,
        colors: product.colors,
        in_stock: product.inStock,
        featured: product.featured,
        rating: product.rating,
        reviews_count: product.reviewsCount,
      };
      await supabase.from('products').upsert(row);
    } catch (err) {
      console.warn('DB Save product error:', err);
    }
  }

  return product;
}

export async function dbDeleteProduct(productId: string): Promise<boolean> {
  memProducts = memProducts.filter(p => p.id !== productId);

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        console.error('Supabase delete product error:', error);
        return false;
      }
    } catch (err) {
      console.warn('DB Delete product error:', err);
      return false;
    }
  }

  return true;
}

// ==========================================
// 2. CATEGORIES DATABASE OPERATIONS
// ==========================================

export async function dbGetCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data: catRows, error: catErr } = await supabase
        .from('categories')
        .select('*, subcategories(*)');

      if (!catErr && catRows && catRows.length > 0) {
        memCategories = catRows.map((c: any) => ({
          id: c.id,
          name: c.name,
          subcategories: (c.subcategories || []).map((s: any) => ({
            id: s.id,
            name: s.name,
          }))
        }));
        return memCategories;
      }
    } catch (err) {
      console.warn('DB Categories fetch fallback to memory:', err);
    }
  }
  return [...memCategories];
}

export async function dbSaveCategory(category: Category): Promise<Category> {
  const idx = memCategories.findIndex(c => c.id === category.id);
  if (idx >= 0) {
    memCategories[idx] = { ...category };
  } else {
    memCategories.push({ ...category });
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('categories').upsert({
        id: category.id,
        name: category.name,
      });

      if (category.subcategories && category.subcategories.length > 0) {
        const subRows = category.subcategories.map(s => ({
          id: s.id,
          category_id: category.id,
          name: s.name,
        }));
        await supabase.from('subcategories').upsert(subRows);
      }
    } catch (err) {
      console.warn('DB Save category error:', err);
    }
  }

  return category;
}

export async function dbDeleteCategory(categoryId: string): Promise<boolean> {
  memCategories = memCategories.filter(c => c.id !== categoryId);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('subcategories').delete().eq('category_id', categoryId);
      await supabase.from('categories').delete().eq('id', categoryId);
    } catch (err) {
      console.warn('DB Delete category error:', err);
    }
  }

  return true;
}

export async function dbAddSubcategory(categoryId: string, subcategory: { id: string; name: string }): Promise<boolean> {
  const cat = memCategories.find(c => c.id === categoryId);
  if (cat) {
    cat.subcategories = [...(cat.subcategories || []), subcategory];
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('subcategories').insert({
        id: subcategory.id,
        category_id: categoryId,
        name: subcategory.name,
      });
    } catch (err) {
      console.warn('DB Add subcategory error:', err);
    }
  }

  return true;
}

export async function dbDeleteSubcategory(categoryId: string, subcategoryId: string): Promise<boolean> {
  const cat = memCategories.find(c => c.id === categoryId);
  if (cat) {
    cat.subcategories = cat.subcategories.filter(s => s.id !== subcategoryId);
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('subcategories').delete().eq('id', subcategoryId);
    } catch (err) {
      console.warn('DB Delete subcategory error:', err);
    }
  }

  return true;
}

// ==========================================
// 3. USERS & AUTH DATABASE OPERATIONS (No Email Confirmation, No RLS)
// ==========================================

export async function dbRegisterUser(userData: {
  email: string;
  password?: string;
  name: string;
  phone?: string;
}): Promise<{ success: boolean; user?: User; error?: string }> {
  const emailNorm = userData.email.trim().toLowerCase();
  
  // Check if exists in memory
  const existing = memUsers.find(u => u.email.toLowerCase() === emailNorm);
  if (existing) {
    return { success: false, error: 'Este correo electrónico ya se encuentra registrado.' };
  }

  const newUserId = `usr_${Date.now()}`;
  const newUser: User & { password?: string } = {
    id: newUserId,
    email: emailNorm,
    password: userData.password || 'sunns_guest_pass',
    name: userData.name.trim(),
    phone: userData.phone || '',
    role: 'user',
    tier: 'Club Privé Member',
    memberSince: new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date()),
    totalSpent: 0,
    loyaltyPoints: 100, // 100 welcome points
    addresses: [],
    paymentMethods: [],
    twoFactorEnabled: false,
  };

  memUsers.push(newUser);
  memActiveUser = { ...newUser };
  delete (memActiveUser as any).password;

  if (isSupabaseConfigured()) {
    try {
      // 1. Also register in Supabase Auth (auth.users) so it displays in the "Authentication -> Users" dashboard
      let authUserId: string | null = null;
      try {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: newUser.email,
          password: newUser.password || 'sunns_pass_123',
          options: {
            data: {
              name: newUser.name,
              phone: newUser.phone,
              role: newUser.role,
            }
          }
        });
        if (!authErr && authData?.user?.id) {
          authUserId = authData.user.id;
        }
      } catch (authError) {
        console.warn('Supabase Auth signUp sync attempt:', authError);
      }

      // 2. Insert into public.users table (Table Editor -> users)
      const userRecordId = authUserId || newUser.id;
      newUser.id = userRecordId;
      if (memActiveUser) memActiveUser.id = userRecordId;

      await supabase.from('users').upsert({
        id: userRecordId,
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        tier: newUser.tier,
        member_since: newUser.memberSince,
        total_spent: newUser.totalSpent,
        loyalty_points: newUser.loyaltyPoints,
        two_factor_enabled: newUser.twoFactorEnabled,
      });
    } catch (err) {
      console.warn('DB Register user insert error:', err);
    }
  }

  return { success: true, user: memActiveUser };
}

export async function dbLoginUser(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const emailNorm = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', emailNorm)
        .single();

      if (!error && data) {
        if (password && data.password && data.password !== password) {
          return { success: false, error: 'Contraseña incorrecta. Por favor verifica tus credenciales.' };
        }

        // Fetch user addresses, payment methods, prescription
        const { data: addresses } = await supabase.from('addresses').select('*').eq('user_id', data.id);
        const { data: paymentMethods } = await supabase.from('payment_methods').select('*').eq('user_id', data.id);
        const { data: prescription } = await supabase.from('prescriptions').select('*').eq('user_id', data.id).single();

        const user: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          phone: data.phone || '',
          role: data.role || 'user',
          tier: data.tier || 'Miembro Club Privé',
          memberSince: data.member_since || '2026',
          totalSpent: Number(data.total_spent || 0),
          loyaltyPoints: Number(data.loyalty_points || 0),
          stripeCustomerId: data.stripe_customer_id,
          avatar: data.avatar,
          twoFactorEnabled: Boolean(data.two_factor_enabled),
          addresses: (addresses || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            fullName: a.full_name,
            address: a.address,
            city: a.city,
            state: a.state,
            zip: a.zip,
            country: a.country,
            phone: a.phone,
            isDefaultShipping: Boolean(a.is_default_shipping),
            isDefaultBilling: Boolean(a.is_default_billing),
          })),
          paymentMethods: (paymentMethods || []).map((p: any) => ({
            id: p.id,
            brand: p.brand,
            last4: p.last4,
            expMonth: p.exp_month,
            expYear: p.exp_year,
            holderName: p.holder_name,
            isDefault: Boolean(p.is_default),
            stripePaymentMethodId: p.stripe_payment_method_id,
          })),
          prescription: prescription ? {
            sphereOD: prescription.sphere_od,
            sphereOS: prescription.sphere_os,
            cylinderOD: prescription.cylinder_od,
            cylinderOS: prescription.cylinder_os,
            axisOD: prescription.axis_od,
            axisOS: prescription.axis_os,
            pupillaryDistance: prescription.pupillary_distance,
            preferredLensTreatment: prescription.preferred_lens_treatment,
            notes: prescription.notes,
          } : undefined,
        };

        memActiveUser = user;
        return { success: true, user };
      }
    } catch (err) {
      console.warn('DB Login query fallback to memory cache:', err);
    }
  }

  // Memory fallback
  const userMatch = memUsers.find(u => u.email.toLowerCase() === emailNorm);
  if (!userMatch) {
    return { success: false, error: 'No encontramos ninguna cuenta asociada a este correo electrónico.' };
  }

  if (password && userMatch.password && userMatch.password !== password) {
    return { success: false, error: 'Contraseña incorrecta. Por favor verifica tus credenciales.' };
  }

  const { password: _, ...cleanUser } = userMatch;
  memActiveUser = cleanUser as User;
  return { success: true, user: cleanUser as User };
}

export function dbGetActiveSession(): User | null {
  return memActiveUser;
}

export function dbLogoutUser(): void {
  memActiveUser = null;
}

export async function dbUpdateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
  const userIdx = memUsers.findIndex(u => u.id === userId);
  if (userIdx >= 0) {
    memUsers[userIdx] = { ...memUsers[userIdx], ...updates };
  }

  if (memActiveUser && memActiveUser.id === userId) {
    memActiveUser = { ...memActiveUser, ...updates };
  }

  if (isSupabaseConfigured()) {
    try {
      const dbRow: any = {};
      if (updates.name !== undefined) dbRow.name = updates.name;
      if (updates.phone !== undefined) dbRow.phone = updates.phone;
      if (updates.tier !== undefined) dbRow.tier = updates.tier;
      if (updates.totalSpent !== undefined) dbRow.total_spent = updates.totalSpent;
      if (updates.loyaltyPoints !== undefined) dbRow.loyalty_points = updates.loyaltyPoints;
      if (updates.twoFactorEnabled !== undefined) dbRow.two_factor_enabled = updates.twoFactorEnabled;

      if (Object.keys(dbRow).length > 0) {
        await supabase.from('users').update(dbRow).eq('id', userId);
      }
    } catch (err) {
      console.warn('DB Update user profile error:', err);
    }
  }

  return memActiveUser;
}

export async function dbGetAllUsers(): Promise<User[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          email: d.email,
          name: d.name,
          phone: d.phone,
          role: d.role,
          tier: d.tier,
          memberSince: d.member_since,
          totalSpent: Number(d.total_spent || 0),
          loyaltyPoints: Number(d.loyalty_points || 0),
          addresses: [],
          paymentMethods: [],
        }));
      }
    } catch (err) {
      console.warn('DB Get all users error:', err);
    }
  }
  return memUsers.map(({ password: _, ...u }) => u as User);
}

// ==========================================
// 4. ORDERS & HISTORIALES DATABASE OPERATIONS
// ==========================================

export async function dbSaveOrder(userId: string, order: Order): Promise<boolean> {
  if (!memOrders[userId]) {
    memOrders[userId] = [];
  }
  memOrders[userId].unshift(order);

  // Update user spent & points
  const user = memUsers.find(u => u.id === userId);
  if (user) {
    user.totalSpent = (user.totalSpent || 0) + order.total;
    user.loyaltyPoints = (user.loyaltyPoints || 0) + Math.round(order.total * 10);
  }

  if (isSupabaseConfigured()) {
    try {
      // 1. Insert order
      await supabase.from('orders').insert({
        id: order.id,
        user_id: userId,
        order_number: order.orderNumber,
        date: order.date,
        created_at: order.createdAt || new Date().toISOString(),
        status: order.status,
        status_label: order.statusLabel,
        subtotal: order.subtotal,
        shipping: order.shippingCost || 0,
        discount: order.discount,
        total: order.total,
        courier: order.courier || null,
        tracking_number: order.trackingNumber || null,
        payment_method_type: order.paymentMethod.type,
        payment_method_brand: order.paymentMethod.brand,
        payment_method_last4: order.paymentMethod.last4,
        stripe_payment_intent_id: order.paymentMethod.stripePaymentIntentId || null,
        stripe_receipt_url: order.paymentMethod.stripeReceiptUrl || null,
        shipping_full_name: order.shippingAddress.fullName,
        shipping_address: order.shippingAddress.address,
        shipping_city: order.shippingAddress.city,
        shipping_state: order.shippingAddress.state,
        shipping_zip: order.shippingAddress.zip,
        shipping_country: order.shippingAddress.country,
      });

      // 2. Insert order items
      if (order.items && order.items.length > 0) {
        const itemRows = order.items.map((item, idx) => ({
          id: `item_${order.id}_${idx}`,
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          product_image: item.productImage,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          color: item.colorName || '',
        }));
        await supabase.from('order_items').insert(itemRows);
      }

      // 3. Update user total spent in DB
      if (user) {
        await supabase.from('users').update({
          total_spent: user.totalSpent,
          loyalty_points: user.loyaltyPoints,
        }).eq('id', userId);
      }
    } catch (err) {
      console.warn('DB Save order error:', err);
    }
  }

  return true;
}

export async function dbGetUserOrders(userId: string): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data: orderRows, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && orderRows && orderRows.length > 0) {
        return orderRows.map((r: any) => ({
          id: r.id,
          orderNumber: r.order_number,
          date: r.date,
          createdAt: r.created_at,
          status: r.status,
          statusLabel: r.status_label,
          subtotal: Number(r.subtotal),
          shippingCost: Number(r.shipping || 0),
          discount: Number(r.discount || 0),
          tax: 0,
          total: Number(r.total),
          courier: r.courier,
          trackingNumber: r.tracking_number,
          paymentMethod: {
            type: r.payment_method_type,
            brand: r.payment_method_brand,
            last4: r.payment_method_last4,
            stripePaymentIntentId: r.stripe_payment_intent_id,
            stripeReceiptUrl: r.stripe_receipt_url,
          },
          shippingAddress: {
            fullName: r.shipping_full_name,
            address: r.shipping_address,
            city: r.shipping_city,
            state: r.shipping_state,
            zip: r.shipping_zip,
            country: r.shipping_country,
            phone: '+1 (305) 555-0100',
          },
          items: (r.order_items || []).map((i: any) => ({
            productId: i.product_id,
            productName: i.product_name,
            productImage: i.product_image,
            category: 'Sol',
            colorName: i.color || 'Negro Carbón',
            colorValue: '#1A1A1A',
            quantity: Number(i.quantity),
            unitPrice: Number(i.unit_price),
            totalPrice: Number(i.unit_price) * Number(i.quantity),
          }))
        }));
      }
    } catch (err) {
      console.warn('DB Get user orders error:', err);
    }
  }

  return memOrders[userId] || [];
}

export async function dbGetAllGlobalOrders(): Promise<AdminOrderEntry[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data: orderRows, error } = await supabase
        .from('orders')
        .select('*, order_items(*), users(name, email)')
        .order('created_at', { ascending: false });

      if (!error && orderRows && orderRows.length > 0) {
        return orderRows.map((r: any) => ({
          userId: r.user_id,
          userEmail: r.users?.email || 'cliente@sunnsshop.com',
          userName: r.users?.name || r.shipping_full_name || 'Cliente SUNNS',
          order: {
            id: r.id,
            orderNumber: r.order_number,
            date: r.date,
            createdAt: r.created_at,
            status: r.status,
            statusLabel: r.status_label,
            subtotal: Number(r.subtotal),
            shippingCost: Number(r.shipping || 0),
            discount: Number(r.discount || 0),
            tax: 0,
            total: Number(r.total),
            courier: r.courier,
            trackingNumber: r.tracking_number,
            paymentMethod: {
              type: r.payment_method_type,
              brand: r.payment_method_brand,
              last4: r.payment_method_last4,
              stripePaymentIntentId: r.stripe_payment_intent_id,
              stripeReceiptUrl: r.stripe_receipt_url,
            },
            shippingAddress: {
              fullName: r.shipping_full_name,
              address: r.shipping_address,
              city: r.shipping_city,
              state: r.shipping_state,
              zip: r.shipping_zip,
              country: r.shipping_country,
              phone: '+1 (305) 555-0100',
            },
            items: (r.order_items || []).map((i: any) => ({
              productId: i.product_id,
              productName: i.product_name,
              productImage: i.product_image,
              category: 'Sol',
              colorName: i.color || 'Negro Carbón',
              colorValue: '#1A1A1A',
              quantity: Number(i.quantity),
              unitPrice: Number(i.unit_price),
              totalPrice: Number(i.unit_price) * Number(i.quantity),
            }))
          }
        }));
      }
    } catch (err) {
      console.warn('DB Get all global orders error:', err);
    }
  }

  // Memory fallback
  const globalList: AdminOrderEntry[] = [];
  Object.entries(memOrders).forEach(([userId, orders]) => {
    const user = memUsers.find(u => u.id === userId);
    const userEmail = user?.email || 'cliente@sunnsshop.com';
    const userName = user?.name || orders[0]?.shippingAddress?.fullName || 'Cliente SUNNS';

    orders.forEach(order => {
      globalList.push({
        userId,
        userEmail,
        userName,
        order,
      });
    });
  });

  globalList.sort((a, b) => new Date(b.order.createdAt || b.order.date).getTime() - new Date(a.order.createdAt || a.order.date).getTime());
  return globalList;
}

export const dbGetOrders = dbGetAllGlobalOrders;

export async function dbUpdateOrderStatus(
  orderId: string, 
  newStatus: Order['status'], 
  newStatusLabel?: string,
  courier?: string,
  trackingNumber?: string
): Promise<boolean> {
  const labelMap: Record<Order['status'], string> = {
    paid: 'Pagado',
    processing: 'En Preparación',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  const label = newStatusLabel || labelMap[newStatus] || newStatus;

  // Update memory
  Object.keys(memOrders).forEach(userId => {
    memOrders[userId] = memOrders[userId].map(ord => {
      if (ord.id === orderId) {
        return { 
          ...ord, 
          status: newStatus, 
          statusLabel: label,
          courier: courier || ord.courier,
          trackingNumber: trackingNumber || ord.trackingNumber
        };
      }
      return ord;
    });
  });

  if (isSupabaseConfigured()) {
    try {
      const updates: any = {
        status: newStatus,
        status_label: label,
      };
      if (courier) updates.courier = courier;
      if (trackingNumber) updates.tracking_number = trackingNumber;

      await supabase.from('orders').update(updates).eq('id', orderId);
    } catch (err) {
      console.warn('DB Update order status error:', err);
    }
  }

  return true;
}

export async function dbUpdateOrderTracking(orderId: string, courier: string, trackingNumber: string): Promise<boolean> {
  // Update memory
  Object.keys(memOrders).forEach(userId => {
    memOrders[userId] = memOrders[userId].map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          courier,
          trackingNumber,
          status: ord.status === 'paid' ? 'shipped' : ord.status,
          statusLabel: ord.status === 'paid' ? 'Enviado' : ord.statusLabel,
        };
      }
      return ord;
    });
  });

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('orders').update({
        courier,
        tracking_number: trackingNumber,
        status: 'shipped',
        status_label: 'Enviado',
      }).eq('id', orderId);
    } catch (err) {
      console.warn('DB Update order tracking error:', err);
    }
  }

  return true;
}

// ==========================================
// 5. USER ADDRESSES & PAYMENT METHODS
// ==========================================

export async function dbSaveUserAddress(userId: string, address: SavedAddress): Promise<boolean> {
  const user = memUsers.find(u => u.id === userId);
  if (user) {
    const existingIdx = user.addresses.findIndex(a => a.id === address.id);
    if (existingIdx >= 0) {
      user.addresses[existingIdx] = address;
    } else {
      user.addresses.push(address);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('addresses').upsert({
        id: address.id,
        user_id: userId,
        title: address.title,
        full_name: address.fullName,
        address: address.address,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        phone: address.phone,
        is_default_shipping: address.isDefaultShipping,
        is_default_billing: address.isDefaultBilling,
      });
    } catch (err) {
      console.warn('DB Save address error:', err);
    }
  }

  return true;
}

export async function dbDeleteUserAddress(userId: string, addressId: string): Promise<boolean> {
  const user = memUsers.find(u => u.id === userId);
  if (user) {
    user.addresses = user.addresses.filter(a => a.id !== addressId);
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('addresses').delete().eq('id', addressId);
    } catch (err) {
      console.warn('DB Delete address error:', err);
    }
  }

  return true;
}

export async function dbSaveUserPaymentMethod(userId: string, pm: SavedPaymentMethod): Promise<boolean> {
  const user = memUsers.find(u => u.id === userId);
  if (user) {
    const idx = user.paymentMethods.findIndex(p => p.id === pm.id);
    if (idx >= 0) {
      user.paymentMethods[idx] = pm;
    } else {
      user.paymentMethods.push(pm);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('payment_methods').upsert({
        id: pm.id,
        user_id: userId,
        brand: pm.brand,
        last4: pm.last4,
        exp_month: pm.expMonth,
        exp_year: pm.expYear,
        holder_name: pm.holderName,
        is_default: pm.isDefault,
        stripe_payment_method_id: pm.stripePaymentMethodId || null,
      });
    } catch (err) {
      console.warn('DB Save payment method error:', err);
    }
  }

  return true;
}

export async function dbDeleteUserPaymentMethod(userId: string, pmId: string): Promise<boolean> {
  const user = memUsers.find(u => u.id === userId);
  if (user) {
    user.paymentMethods = user.paymentMethods.filter(p => p.id !== pmId);
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('payment_methods').delete().eq('id', pmId);
    } catch (err) {
      console.warn('DB Delete payment method error:', err);
    }
  }

  return true;
}

// ==========================================
// 6. OPTICAL PRESCRIPTION
// ==========================================

export async function dbSaveUserPrescription(userId: string, prescription: OpticalPrescription): Promise<boolean> {
  const user = memUsers.find(u => u.id === userId);
  if (user) {
    user.prescription = prescription;
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('prescriptions').upsert({
        id: `presc_${userId}`,
        user_id: userId,
        sphere_od: prescription.sphereOD,
        sphere_os: prescription.sphereOS,
        cylinder_od: prescription.cylinderOD,
        cylinder_os: prescription.cylinderOS,
        axis_od: prescription.axisOD,
        axis_os: prescription.axisOS,
        pupillary_distance: prescription.pupillaryDistance,
        preferred_lens_treatment: prescription.preferredLensTreatment,
        notes: prescription.notes,
      });
    } catch (err) {
      console.warn('DB Save prescription error:', err);
    }
  }

  return true;
}

// ==========================================
// 7. COUPONS (WELCOME10, PROMOS)
// ==========================================

export interface CouponRecord {
  code: string;
  discountPercent: number;
  description: string;
  isActive: boolean;
}

let memCoupons: CouponRecord[] = [
  {
    code: 'WELCOME10',
    discountPercent: 10,
    description: '10% OFF Cupón de Bienvenida Club Privé',
    isActive: true,
  },
  {
    code: 'SUNNSVIP',
    discountPercent: 15,
    description: '15% OFF Exclusivo Socios VIP',
    isActive: true,
  }
];

export async function dbGetCoupon(code: string): Promise<CouponRecord | null> {
  const codeNorm = code.trim().toUpperCase();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', codeNorm)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        return {
          code: data.code,
          discountPercent: Number(data.discount_percent),
          description: data.description,
          isActive: Boolean(data.is_active),
        };
      }
    } catch (err) {
      console.warn('DB Get coupon error:', err);
    }
  }

  return memCoupons.find(c => c.code === codeNorm && c.isActive) || null;
}

// ==========================================
// 8. HOME CONTENT MANAGEMENT (Hero, Footer, Sections)
// Persisted in Supabase 'home_content' table
// ==========================================

let memHomeContent: HomeContent = { ...DEFAULT_HOME_CONTENT };

export async function dbGetHomeContent(): Promise<HomeContent> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('home_content')
        .select('*')
        .eq('id', 'main_home')
        .single();

      if (!error && data && data.content) {
        memHomeContent = {
          ...DEFAULT_HOME_CONTENT,
          ...(typeof data.content === 'string' ? JSON.parse(data.content) : data.content)
        };
        return memHomeContent;
      }
    } catch (err) {
      console.warn('DB Get home content error, falling back to memory/default:', err);
    }
  }

  return { ...memHomeContent };
}

export async function dbSaveHomeContent(content: HomeContent): Promise<boolean> {
  memHomeContent = { ...content };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('home_content')
        .upsert({
          id: 'main_home',
          section_key: 'home_landing',
          content: content,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving home content to Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Exception saving home content to Supabase:', err);
      return false;
    }
  }

  return true;
}
