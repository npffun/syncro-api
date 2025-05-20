import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';
import { SyncroTicketsResponse, TicketDto } from 'src/dto/ticket.dto';

@Injectable()
export class SyncroService {
  private readonly logger = new Logger(SyncroService.name);
  private readonly API_BASE_URL = process.env.SYNCRO_BASE_URL;
  private readonly API_KEY = process.env.SYNCRO_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  /**
   * Cron job: Runs daily at 7 PM Saskatchewan time (1 AM UTC).
   */
  @Cron('0 0 1 * * *') // 1:00 AM UTC (7:00 PM CST)
  async handleDailyTicketUpdate() {
    this.logger.log('Starting daily ticket status update...');
    try {
      const tickets = await this.getAllTickets();
      for (const ticket of tickets) {
        await this.updateTicketStatus(ticket.id);
        this.logger.debug(
          `Updated ticket #${ticket.id} (ticket number #${ticket.number})`,
        );
      }
      this.logger.log(`Successfully updated ${tickets.length} tickets.`);
    } catch (error) {
      this.logger.error('Failed to fetch tickets:', (error as Error).message);
      throw error;
    }
  }

  /**
   * Fetches all tickets from Syncro's API.
   */
  private async getAllTickets(): Promise<TicketDto[]> {
    const encodedStatus = encodeURIComponent('Resolve EOD');
    const url = `${this.API_BASE_URL}/tickets?status=${encodedStatus}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<SyncroTicketsResponse>(url, {
          headers: {
            Authorization: `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );
      return response.data.tickets;
    } catch (error) {
      this.logger.error('Failed to fetch tickets:', (error as Error).message);
      throw error;
    }
  }

  /**
   * Updates a single ticket's status.
   */
  private async updateTicketStatus(ticketId: number): Promise<void> {
    const url = `${this.API_BASE_URL}/tickets/${ticketId}`;
    try {
      console.log(`Updating ticket ${ticketId} to status 'Resolved'`);
      console.log(`Request URL: ${url}`);
      console.log(`Request body:`, { status: 'Resolved' });

      const response = await firstValueFrom(
        this.httpService.put(
          url,
          { status: 'Resolved' }, // <-- corrected body
          {
            headers: {
              Authorization: `Bearer ${this.API_KEY}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        ),
      );

      console.log(`Response status: ${response.status}`);
      console.log(`Response data:`, response.data);
    } catch (error) {
      console.error(`Error updating ticket ${ticketId}:`, error);
      this.logger.error(
        'Failed to update ticket status:',
        (error as Error).message,
      );
      throw error;
    }
  }
}
