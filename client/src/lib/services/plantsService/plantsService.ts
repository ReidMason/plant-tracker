"use server";

import { Result, createSuccessResult, createErrorResult, createBackendBaseApi } from '../api';
import { getPlantEvents } from '../eventsService/eventsService';
import { Event } from '../eventsService/types';
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
  lastFertilizerEvent: EventSchema.nullable().optional(),
  nextFertilizerDue: z
    .string()
    .nullable()
    .optional()
    .refine(val => val == null || !val || !isNaN(Date.parse(val)), { message: 'Invalid datetime' })
    .transform(val => (val ? new Date(val) : null)),
});

export type Plant = z.infer<typeof PlantSchema>;

// Utility functions for fertilizer tracking
function isFertilizerEvent(event: Event): boolean {
  return event.note.includes('[FERTILIZE]');
}

function calculateNextFertilizerTime(lastFertilizerTime: Date): Date {
  // Fertilizer is typically needed every 30 days
  return new Date(lastFertilizerTime.getTime() + (30 * 24 * 60 * 60 * 1000));
}

function getLatestFertilizerEvent(events: Event[]): Event | null {
  const fertilizerEvents = events.filter(isFertilizerEvent);
  if (fertilizerEvents.length === 0) return null;
  
  // Sort by timestamp descending and get the latest
  fertilizerEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return fertilizerEvents[0];
}

async function enhancePlantWithFertilizerData(plant: Plant, userId: string | number): Promise<Plant> {
  try {
    // Get all events for this plant
    const eventsResult = await getPlantEvents(userId, plant.id);
    if (!eventsResult.ok) {
      return plant; // Return original plant if we can't get events
    }

    const events = eventsResult.value;
    const latestFertilizerEvent = getLatestFertilizerEvent(events);
    
    if (latestFertilizerEvent) {
      const enhancedPlant: Plant = {
        ...plant,
        lastFertilizerEvent: latestFertilizerEvent,
        nextFertilizerDue: calculateNextFertilizerTime(new Date(latestFertilizerEvent.timestamp))
      };
      return enhancedPlant;
    }
    
    return plant;
  } catch (error) {
    console.error('Error enhancing plant with fertilizer data:', error);
    return plant;
  }
}

export interface CreatePlantRequest {
  name: string;
}

const baseApi = createBackendBaseApi();

export async function getPlantsByUserId(userId: string | number): Promise<Result<Plant[]>> {
  const apiResult = await baseApi.get<unknown[]>(`/users/${userId}/plants`);
  if (!apiResult.ok) return apiResult;
  try {
    const plants = z.array(PlantSchema).parse(apiResult.value);
    
    // Enhance each plant with fertilizer data
    const enhancedPlants = await Promise.all(
      plants.map(plant => enhancePlantWithFertilizerData(plant, userId))
    );
    
    return createSuccessResult(enhancedPlants);
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
    
    // Enhance with fertilizer data
    const enhancedPlant = await enhancePlantWithFertilizerData(plant, userId);
    
    return createSuccessResult(enhancedPlant);
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

export async function updatePlantName(userId: string | number, plantId: string | number, name: string): Promise<Result<Plant>> {
  const apiResult = await baseApi.put<unknown, { name: string }>(`/users/${userId}/plants/${plantId}`, { name });
  if (!apiResult.ok) return apiResult;
  try {
    const plant = PlantSchema.parse(apiResult.value);
    
    // Enhance with fertilizer data
    const enhancedPlant = await enhancePlantWithFertilizerData(plant, userId);
    
    return createSuccessResult(enhancedPlant);
  } catch (e) {
    console.error(e)
    return createErrorResult('Invalid plant data from server');
  }
}
