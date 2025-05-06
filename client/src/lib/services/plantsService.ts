import BaseApi, { Result, createSuccessResult, createErrorResult } from './api';

export interface Plant {
  id: number;
  userId: number;
  name: string;
}

export interface CreatePlantRequest {
  name: string;
}

/**
 * Service for handling plant-related API calls
 */
class PlantsService extends BaseApi {
  /**
   * Get all plants for a specific user
   */
  async getPlantsByUserId(userId: string | number): Promise<Result<Plant[]>> {
    return await this.get<Plant[]>(`/users/${userId}/plants`);
  }

  /**
   * Get a specific plant by ID
   */
  async getPlantById(userId: string | number, plantId: string | number): Promise<Result<Plant>> {
    return await this.get<Plant>(`/users/${userId}/plants/${plantId}`);
  }

  /**
   * Create a new plant
   */
  async createPlant(userId: string | number, plantData: CreatePlantRequest): Promise<Result<Plant>> {
    return await this.post<Plant, CreatePlantRequest>(`/users/${userId}/plants`, plantData);
  }
}

// Create singleton instance
const plantsService = new PlantsService();

export default plantsService; 