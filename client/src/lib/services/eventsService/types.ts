export enum EventType {
  Water = 1
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
