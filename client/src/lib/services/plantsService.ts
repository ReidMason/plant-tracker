import BaseApi, { Result, createSuccessResult, createErrorResult } from './api';

export interface Plant {
  id: number;
  userId: number;
  name: string;
}

export interface CreatePlantRequest {
  name: string;
  userId: number;
}

/**
 * Service for handling plant-related API calls
 */
class PlantsService extends BaseApi {
  /**
   * Get all plants for a specific user
   */
  async getPlantsByUserId(userId: string | number): Promise<Result<Plant[]>> {
    return await this.get<Plant[]>(`/plants/user/${userId}`);
  }

  /**
   * Get a specific plant by ID
   */
  async getPlantById(id: string | number): Promise<Result<Plant>> {
    return await this.get<Plant>(`/plants/${id}`);
  }

  /**
   * Create a new plant
   */
  async createPlant(plantData: CreatePlantRequest): Promise<Result<Plant>> {
    return await this.post<Plant, CreatePlantRequest>('/plants', plantData);
  }
}

// Create singleton instance
const plantsService = new PlantsService();

export default plantsService; 