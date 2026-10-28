import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.models';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-ticket-list',
  styleUrl: './ticket-list.css',
  templateUrl: './ticket-list.html',
})
export class TicketList implements OnInit {
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);

  tickets: Ticket[] = [];
  cargando: boolean = true;
  mensajeError: string = '';

  ngOnInit(): void {
    this.obtenerTickets();
  }

  obtenerTickets(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.cdr.markForCheck();

    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar tickets:', err);
        this.mensajeError = 'No fue posible conectar con el servidor backend. Verifique que la API este iniciada.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  confirmarEliminacion(id: number | undefined): void {
    if (!id) return;

    const confirmacion = confirm(`¿Esta seguro de que desea eliminar el ticket #${id}? Esta accion no se puede deshacer.`);
    if (confirmacion) {
      this.ticketService.eliminarTicket(id).subscribe({
        next: () => {
          this.tickets = this.tickets.filter(t => t.id !== id);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al eliminar ticket:', err);
          alert('Ocurrio un error al intentar eliminar el ticket.');
        }
      });
    }
  }

  obtenerClasePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'Critica': return 'badge-prioridad-critica';
      case 'Alta': return 'badge-prioridad-alta';
      case 'Media': return 'badge-prioridad-media';
      case 'Baja': return 'badge-prioridad-baja';
      default: return 'badge-default';
    }
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Abierto': return 'badge-estado-abierto';
      case 'En Progreso': return 'badge-estado-progreso';
      case 'Resuelto': return 'badge-estado-resuelto';
      case 'Cerrado': return 'badge-estado-cerrado';
      default: return 'badge-default';
    }
  }
}