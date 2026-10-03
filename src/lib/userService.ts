/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Order, SavedAddress, SavedPaymentMethod, OpticalPrescription } from '../types';
import {
  dbGetProducts,
  dbSaveProduct,
  dbDeleteProduct,
  dbGetCategories,
  dbSaveCategory,
  dbDeleteCategory,
  dbAddSubcategory,
  dbDeleteSubcategory,
  dbRegisterUser,
  dbLoginUser,
  dbGetActiveSession,
  dbLogoutUser,
  dbUpdateUserProfile,
  dbGetAllUsers,
  dbSaveOrder,
  dbGetUserOrders,
  dbGetAllGlobalOrders,
  dbUpdateOrderStatus,
  dbUpdateOrderTracking,
  dbSaveUserAddress,
  dbDeleteUserAddress,
  dbSaveUserPaymentMethod,
  dbDeleteUserPaymentMethod,
  dbSaveUserPrescription,
  dbGetCoupon,
  dbGetHomeContent,
  dbSaveHomeContent,
  AdminOrderEntry
} from './dbService';

export type { AdminOrderEntry };

// Re-export all database functions cleanly for backwards compatibility with any component
export {
  dbGetProducts,
  dbSaveProduct,
  dbDeleteProduct,
  dbGetCategories,
  dbSaveCategory,
  dbDeleteCategory,
  dbAddSubcategory,
  dbDeleteSubcategory,
  dbRegisterUser,
  dbLoginUser,
  dbGetActiveSession,
  dbLogoutUser,
  dbUpdateUserProfile,
  dbGetAllUsers,
  dbSaveOrder,
  dbGetUserOrders,
  dbGetAllGlobalOrders,
  dbUpdateOrderStatus,
  dbUpdateOrderTracking,
  dbSaveUserAddress,
  dbDeleteUserAddress,
  dbSaveUserPaymentMethod,
  dbDeleteUserPaymentMethod,
  dbSaveUserPrescription,
  dbGetCoupon,
  dbGetHomeContent,
  dbSaveHomeContent,
};

// Convenience legacy wrappers completely free of localStorage:
export const getAllRegisteredUsers = (): User[] => {
  return [
    {
      id: 'usr_admin_001',
      email: 'admin@sunnsshop.com',
      name: 'Alexander Rossi',
      role: 'admin',
      tier: 'Black Elite',
      memberSince: 'Marzo 2024',
      totalSpent: 1240,
      loyaltyPoints: 12400,
      addresses: [],
      paymentMethods: [],
    },
    {
      id: 'usr_vip_002',
      email: 'socio@sunnsshop.com',
      name: 'Valeria Montiel',
      role: 'user',
      tier: 'Prestige VIP',
      memberSince: 'Enero 2025',
      totalSpent: 630,
      loyaltyPoints: 6300,
      addresses: [],
      paymentMethods: [],
    }
  ];
};

export const registerUser = async (userData: { email: string; password?: string; name: string; phone?: string }) => {
  return await dbRegisterUser(userData);
};

export const loginUser = async (email: string, password?: string) => {
  return await dbLoginUser(email, password);
};

export const getActiveSessionUser = (): User | null => {
  return dbGetActiveSession();
};

export const logoutUser = (): void => {
  dbLogoutUser();
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> => {
  const user = await dbUpdateUserProfile(userId, updates);
  if (user) return { success: true, user };
  return { success: false, error: 'No se pudo actualizar el perfil.' };
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  return await dbGetUserOrders(userId);
};

export const getAllGlobalOrders = async (): Promise<AdminOrderEntry[]> => {
  return await dbGetAllGlobalOrders();
};

export const saveUserOrder = async (userId: string, newOrder: Order): Promise<void> => {
  await dbSaveOrder(userId, newOrder);
};

export const updateGlobalOrderStatus = async (orderId: string, newStatus: Order['status'], newStatusLabel?: string): Promise<boolean> => {
  return await dbUpdateOrderStatus(orderId, newStatus, newStatusLabel);
};

export const updateGlobalOrderTracking = async (orderId: string, courier: string, trackingNumber: string): Promise<boolean> => {
  return await dbUpdateOrderTracking(orderId, courier, trackingNumber);
};

export const saveUserAddress = async (userId: string, newAddress: SavedAddress): Promise<void> => {
  await dbSaveUserAddress(userId, newAddress);
};

export const deleteUserAddress = async (userId: string, addressId: string): Promise<void> => {
  await dbDeleteUserAddress(userId, addressId);
};

export const saveUserPaymentMethod = async (userId: string, newMethod: SavedPaymentMethod): Promise<void> => {
  await dbSaveUserPaymentMethod(userId, newMethod);
};

export const deleteUserPaymentMethod = async (userId: string, paymentMethodId: string): Promise<void> => {
  await dbDeleteUserPaymentMethod(userId, paymentMethodId);
};

export const saveUserPrescription = async (userId: string, prescription: OpticalPrescription): Promise<void> => {
  await dbSaveUserPrescription(userId, prescription);
};

export const authenticateUser = async (email: string, password?: string) => {
  return await dbLoginUser(email, password);
};

export const registerNewUser = async (userData: { email: string; password?: string; name: string; phone?: string }) => {
  return await dbRegisterUser(userData);
};

export const requestPasswordReset = async (_email: string): Promise<{ success: boolean; code?: string; error?: string }> => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return { success: true, code };
};

export const resetPasswordWithCode = async (_email: string, _code: string, _newPassword: string): Promise<{ success: boolean; error?: string }> => {
  return { success: true };
};

export const changeUserEmail = async (userId: string, newEmail: string, _currentPass: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  const user = await dbUpdateUserProfile(userId, { email: newEmail });
  if (user) return { success: true, user };
  return { success: false, error: 'No se pudo actualizar el correo electrónico.' };
};

export const changeUserPassword = async (_userId: string, _currentPass: string, _newPass: string): Promise<{ success: boolean; error?: string }> => {
  return { success: true };
};

export const getActiveSession = (): User | null => {
  return dbGetActiveSession();
};

export const setActiveSession = (user: User | null): void => {
  if (!user) dbLogoutUser();
};

