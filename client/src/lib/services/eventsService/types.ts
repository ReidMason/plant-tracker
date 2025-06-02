export enum EventType {
  Water = 1,
  Fertilize = 2
}

export interface Event {
  id: number;
  plantId: number;
  typeId: EventType;
  note: string;
  timestamp: string;
}

export interface CreateEventRequest {
  eventType: EventType;
  note: string;
}
