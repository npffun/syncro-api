export interface TicketDto {
  id: number; // Internal database ID used for API operations
  number: number; // External ticket number visible to users
  status?: string; // Optional field for the ticket's current status
}

export interface SyncroTicketsResponse {
  tickets: TicketDto[];
}
