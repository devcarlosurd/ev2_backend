import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.models';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  // Inyección moderna de dependencias en Angular
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/tickets';

  // 1. Obtener todos los tickets (GET)
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  // 2. Obtener un ticket por ID (GET)
  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  // 3. Crear un nuevo ticket (POST)
  crearTicket(ticket: Omit<Ticket, 'id' | 'fechaRegistro'>): Observable<any> {
    return this.http.post(this.apiUrl, ticket);
  }

  // 4. Actualizar un ticket existente (PUT)
  actualizarTicket(id: number, ticket: Partial<Ticket>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ticket);
  }

  // 5. Eliminar un ticket (DELETE)
  eliminarTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}