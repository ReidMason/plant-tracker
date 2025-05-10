"use server";

import { createBackendBaseApi, Result } from '../api';

export interface User {
  id: number;
  name: string;
  colour: string;
}

export interface CreateUserRequest {
  name: string;
}

const baseApi = createBackendBaseApi();

export async function getUserById(id: string | number): Promise<Result<User>> {
  return await baseApi.get<User>(`/users/${id}`);
}

export async function getUsers(): Promise<Result<User[]>> {
  return await baseApi.get<User[]>('/users');
}

export async function createUser(userData: CreateUserRequest): Promise<Result<User>> {
  return await baseApi.post<User, CreateUserRequest>('/users', userData);
}
