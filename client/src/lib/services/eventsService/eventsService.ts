"use server";

import { createBackendBaseApi, Result } from '../api';
import { CreateEventRequest, Event, EventType } from './types';

const baseApi = createBackendBaseApi();

export async function getPlantEvents(userId: string | number, plantId: string | number): Promise<Result<Event[]>> {
  return await baseApi.get<Event[]>(`/users/${userId}/plants/${plantId}/events`);
}

export async function createWateringEvent(userId: string | number, plantId: string | number, data: CreateEventRequest): Promise<Result<Event>> {
  return await baseApi.post<Event, CreateEventRequest>(`/users/${userId}/plants/${plantId}/events`, {
    ...data,
    eventType: EventType.Water
  });
}

export async function createFertilizeEvent(userId: string | number, plantId: string | number, data: CreateEventRequest): Promise<Result<Event>> {
  return await baseApi.post<Event, CreateEventRequest>(`/users/${userId}/plants/${plantId}/events`, {
    ...data,
    eventType: EventType.Fertilize
  });
}
