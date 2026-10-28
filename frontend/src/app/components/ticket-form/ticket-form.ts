import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-ticket-form',
  styleUrl: './ticket-form.css',
  templateUrl: './ticket-form.html',
})
export class TicketForm implements OnInit {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ticketForm!: FormGroup;
  modoEdicion: boolean = false;
  ticketId: number | null = null;
  guardando: boolean = false;
  mensajeError: string = '';

  categorias = ['Software', 'Hardware', 'Redes', 'Accesos', 'Otro'];
  prioridades = ['Baja', 'Media', 'Alta', 'Critica'];
  estados = ['Abierto', 'En Progreso', 'Resuelto', 'Cerrado'];

  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarModoEdicion();
  }

  inicializarFormulario(): void {
    this.ticketForm = this.fb.group({
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      solicitante: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['Software', Validators.required],
      prioridad: ['Media', Validators.required],
      estado: ['Abierto', Validators.required]
    });
  }

  verificarModoEdicion(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicion = true;
      this.ticketId = Number(idParam);

      this.ticketService.getTicketById(this.ticketId).subscribe({
        next: (ticket) => {
          this.ticketForm.patchValue({
            asunto: ticket.asunto,
            solicitante: ticket.solicitante,
            descripcion: ticket.descripcion,
            categoria: ticket.categoria,
            prioridad: ticket.prioridad,
            estado: ticket.estado
          });
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al cargar ticket para edicion:', err);
          this.mensajeError = 'No fue posible cargar el ticket solicitado.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.ticketForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  guardar(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    if (this.modoEdicion && this.ticketId) {
      this.ticketService.actualizarTicket(this.ticketId, this.ticketForm.value).subscribe({
        next: () => {
          this.router.navigate(['/tickets']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.mensajeError = 'Ocurrio un error al intentar actualizar el ticket.';
          this.guardando = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.ticketService.crearTicket(this.ticketForm.value).subscribe({
        next: () => {
          this.router.navigate(['/tickets']);
        },
        error: (err) => {
          console.error('Error al registrar:', err);
          this.mensajeError = 'Ocurrio un error al intentar registrar el nuevo ticket.';
          this.guardando = false;
          this.cdr.markForCheck();
        }
      });
    }
  }
}