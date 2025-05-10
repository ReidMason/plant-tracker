import BaseApi, { Result, createSuccessResult, createErrorResult } from './api';
import { z } from 'zod';
import type { Event } from './eventsService';

const EventSchema = z.object({
  id: z.number(),
  plantId: z.number(),
  typeId: z.number(),
  note: z.string(),
  timestamp: z.string(),
});

export const PlantSchema = z.object({
  id: z.number(),
  name: z.string(),
  lastWaterEvent: EventSchema.nullable().optional(),
  nextWaterDue: z
    .string()
    .nullable()
    .optional()
    .refine(val => val == null || !val || !isNaN(Date.parse(val)), { message: 'Invalid datetime' })
    .transform(val => (val ? new Date(val) : null)),
});

export type Plant = z.infer<typeof PlantSchema>;

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
    const apiResult = await this.get<unknown[]>(`/users/${userId}/plants`);
    if (!apiResult.ok) return apiResult;
    try {
      const plants = z.array(PlantSchema).parse(apiResult.value);
      return createSuccessResult(plants);
    } catch (e) {
      console.error(e)
      return createErrorResult('Invalid plant data from server');
    }
  }

  /**
   * Get a specific plant by ID
   */
  async getPlantById(userId: string | number, plantId: string | number): Promise<Result<Plant>> {
    const apiResult = await this.get<unknown>(`/users/${userId}/plants/${plantId}`);
    if (!apiResult.ok) return apiResult;
    try {
      const plant = PlantSchema.parse(apiResult.value);
      return createSuccessResult(plant);
    } catch (e) {
      return createErrorResult('Invalid plant data from server');
    }
  }

  /**
   * Create a new plant
   */
  async createPlant(userId: string | number, plantData: CreatePlantRequest): Promise<Result<Plant>> {
    // Assume the response is a single plant object
    const apiResult = await this.post<unknown, CreatePlantRequest>(`/users/${userId}/plants`, plantData);
    if (!apiResult.ok) return apiResult;
    try {
      const plant = PlantSchema.parse(apiResult.value);
      return createSuccessResult(plant);
    } catch (e) {
      return createErrorResult('Invalid plant data from server');
    }
  }
}

// Create singleton instance
const plantsService = new PlantsService();

export default plantsService; 
