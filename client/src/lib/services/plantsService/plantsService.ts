"use server";

import { Result, createSuccessResult, createErrorResult, createBackendBaseApi } from '../api';
import { z } from 'zod';

const EventSchema = z.object({
  id: z.number(),
  plantId: z.number(),
  typeId: z.number(),
  note: z.string(),
  timestamp: z.string(),
});

const PlantSchema = z.object({
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

const baseApi = createBackendBaseApi();

export async function getPlantsByUserId(userId: string | number): Promise<Result<Plant[]>> {
  const apiResult = await baseApi.get<unknown[]>(`/users/${userId}/plants`);
  if (!apiResult.ok) return apiResult;
  try {
    const plants = z.array(PlantSchema).parse(apiResult.value);
    return createSuccessResult(plants);
  } catch (e) {
    console.error(e)
    return createErrorResult('Invalid plant data from server');
  }
}

export async function getPlantById(userId: string | number, plantId: string | number): Promise<Result<Plant>> {
  const apiResult = await baseApi.get<unknown>(`/users/${userId}/plants/${plantId}`);
  if (!apiResult.ok) return apiResult;
  try {
    const plant = PlantSchema.parse(apiResult.value);
    return createSuccessResult(plant);
  } catch (e) {
    console.error(e)
    return createErrorResult('Invalid plant data from server');
  }
}

export async function createPlant(userId: string | number, plantData: CreatePlantRequest): Promise<Result<Plant>> {
  const apiResult = await baseApi.post<unknown, CreatePlantRequest>(`/users/${userId}/plants`, plantData);
  if (!apiResult.ok) return apiResult;
  try {
    const plant = PlantSchema.parse(apiResult.value);
    return createSuccessResult(plant);
  } catch (e) {
    console.error(e)
    return createErrorResult('Invalid plant data from server');
  }
}
