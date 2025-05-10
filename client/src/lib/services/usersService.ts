import BaseApi, { Result } from './api';

export interface User {
  id: number;
  name: string;
  colour: string;
}

export interface CreateUserRequest {
  name: string;
}

/**
 * Service for handling user-related API calls
 */
class UsersService extends BaseApi {
  /**
   * Get all users
   */
  async getUsers(): Promise<Result<User[]>> {
    return await this.get<User[]>('/users');
  }

  /**
   * Get a specific user by ID
   */
  async getUserById(id: string | number): Promise<Result<User>> {
    return await this.get<User>(`/users/${id}`);
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<Result<User>> {
    return await this.post<User, CreateUserRequest>('/users', userData);
  }
}

// Create singleton instance
const usersService = new UsersService();

export default usersService; 
