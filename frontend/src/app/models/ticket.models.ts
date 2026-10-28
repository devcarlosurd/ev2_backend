export interface Ticket {
  id?: number;
  asunto: string;
  solicitante: string;
  descripcion: string;
  categoria: 'Hardware' | 'Software' | 'Redes' | 'Accesos' | 'Otro';
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Critica';
  estado: 'Abierto' | 'En Progreso' | 'Resuelto' | 'Cerrado';
  fechaRegistro?: string;
}