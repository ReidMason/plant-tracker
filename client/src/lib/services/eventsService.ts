import BaseApi, { Result } from './api';

export enum EventType {
  Water
}

export interface Event {
  id: number;
  plantId: number;
  typeId: EventType;
  note: string;
  timestamp: string;
}

export interface CreateEventRequest {
  note: string;
}

/**
 * Service for handling plant event-related API calls
 */
class EventsService extends BaseApi {
  /**
   * Get events for a specific plant
   */
  async getPlantEvents(userId: string | number, plantId: string | number): Promise<Result<Event[]>> {
    return await this.get<Event[]>(`/users/${userId}/plants/${plantId}/events`);
  }

  /**
   * Create a watering event for a plant
   */
  async createWateringEvent(userId: string | number, plantId: string | number, data: CreateEventRequest): Promise<Result<Event>> {
    return await this.post<Event, CreateEventRequest>(`/users/${userId}/plants/${plantId}/events`, data);
  }
}

// Create singleton instance
const eventsService = new EventsService();

export default eventsService; 
