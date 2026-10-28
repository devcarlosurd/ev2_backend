# Sistema de Gestión de Soporte Técnico

Proyecto full stack para el registro, consulta, actualización y eliminación (CRUD) de tickets de soporte técnico, desarrollado para la Evaluación N.° 2 del Electivo Angular en el Instituto Profesional Virginio Gómez.

---

## 1. Autor
- **Estudiante:** Carlos Urdaneta Araujo
- **Carrera:** Ingeniería en Informática
- **Institución:** Instituto Profesional Virginio Gómez

---

## 2. Descripción del Proyecto
Aplicación web corporativa diseñada para reemplazar el registro manual de solicitudes de soporte técnico. Permite a los usuarios y técnicos registrar incidencias, consultar el listado en tiempo real, modificar estados o prioridades, y eliminar solicitudes resueltas con confirmación previa. La información se almacena de forma persistente en una base de datos relacional MySQL mediante una API REST desarrollada en Node.js y Express.

---

## 3. Tecnologías Utilizadas
- **Frontend:** Angular 22 (Standalone Components, Zoneless Change Detection, Reactive Forms, Routing, HttpClient con Fetch API).
- **Backend:** Node.js v24 y Express 5 (Arquitectura RESTful, CORS, Dotenv).
- **Base de Datos:** MySQL Server (Driver `mysql2/promise` con Connection Pool y consultas parametrizadas contra SQL Injection).
- **Control de Versiones:** Git y GitHub.

---

## 4. Estructura General del Proyecto
```text
ev2_backend/
├── backend/
│   ├── src/
│   │   ├── db.js             # Configuracion del Pool de conexiones MySQL
│   │   └── index.js          # Servidor Express, middlewares y rutas CRUD
│   ├── .env                  # Variables de entorno locales (ignorado por Git)
│   ├── .env.example          # Plantilla de variables de entorno
│   ├── database.sql          # Script DDL/DML de creacion y datos de prueba
│   └── package.json          # Dependencias y scripts del backend
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── ticket-list/   # Tabla de tickets, filtros visuales y acciones
│   │   │   │   └── ticket-form/   # Formulario reactivo para creacion y edicion
│   │   │   ├── models/            # Interfaces TypeScript (Ticket)
│   │   │   ├── services/          # TicketService con metodos HTTP
│   │   │   ├── app.routes.ts      # Enrutamiento de la aplicacion
│   │   │   └── app.config.ts      # Configuracion global y provideHttpClient
│   └── package.json          # Dependencias de Angular 22
└── README.md                 # Documentacion tecnica y de ejecucion
```

---

## 5. Instrucciones de Instalación y Configuración

### Requisitos previos
- Node.js (v18 o superior) y npm.
- MySQL Server en ejecución.
- Angular CLI 22 (`npm install -g @angular/cli`).

### Paso 1: Configurar la Base de Datos
Ejecute el script `backend/database.sql` en su cliente MySQL o por consola:
```powershell
Get-Content "backend\database.sql" -Encoding utf8 -Raw | mysql -u root -p
```
Esto creará la base de datos `soporte_tickets_db`, la tabla `tickets` y 3 registros iniciales.

### Paso 2: Configurar y Ejecutar el Backend
1. Ingrese a la carpeta `backend`:
   ```powershell
   cd backend
   ```
2. Instale dependencias:
   ```powershell
   npm install
   ```
3. Cree el archivo `.env` a partir de `.env.example`:
   ```powershell
   cp .env.example .env
   ```
   *(Asegúrese de que el usuario y la contraseña de MySQL en `.env` coincidan con su servidor local).*
4. Inicie la API en modo desarrollo:
   ```powershell
   npm run dev
   ```
   La API quedará escuchando en `http://localhost:3000`.

### Paso 3: Configurar y Ejecutar el Frontend
1. En otra terminal, ingrese a la carpeta `frontend`:
   ```powershell
   cd frontend
   ```
2. Instale dependencias:
   ```powershell
   npm install
   ```
3. Inicie el servidor de desarrollo de Angular:
   ```powershell
   ng serve
   ```
4. Abra su navegador en: `http://localhost:4200`.

---

## 6. Funcionalidades Implementadas
- [x] **Listado dinámico (GET):** Visualización de tickets ordenados cronológicamente desde MySQL.
- [x] **Registro con validación (POST):** Formulario reactivo con control de obligatoriedad y longitudes mínimas.
- [x] **Edición persistente (PUT):** Carga automática de datos existentes por parámetro de ruta `:id` y actualización en BD.
- [x] **Eliminación controlada (DELETE):** Cuadro de diálogo de confirmación antes de borrar registros.
- [x] **Distinción visual:** Insignias de colores diferenciadas según Estado (`Abierto`, `En Progreso`, `Resuelto`, `Cerrado`) y Prioridad (`Baja`, `Media`, `Alta`, `Critica`).
- [x] **Manejo de errores:** Notificaciones visuales en la interfaz ante desconexión o fallas en el backend.
- [x] **Seguridad:** Consultas SQL parametrizadas (`?`) para neutralizar inyecciones de código.

---

## 7. Pruebas Mínimas Realizadas (Sección 12 de la pauta)

| Prueba | Acción Ejecutada | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **Inicio** | Ejecución de API (`npm run dev`) y Angular (`ng serve`). | La interfaz y la API levantan sin errores de compilación. | Conexión exitosa en puertos 3000 y 4200. | Superada |
| **GET** | Ingreso a `http://localhost:4200/tickets`. | La tabla lista los tickets almacenados en MySQL. | Datos recuperados y renderizados con insignias. | Superada |
| **POST** | Creación de ticket desde `/tickets/nuevo`. | El nuevo ticket se guarda en la base de datos y se muestra en la lista. | Registro insertado en MySQL y visible de inmediato. | Superada |
| **PUT** | Modificación de prioridad y estado en ticket existente. | Los cambios se persisten y se visualizan actualizados. | Ticket actualizado tras recargar la página. | Superada |
| **DELETE** | Presionar botón "Eliminar" en un ticket. | Solicita confirmación y lo borra de la vista y de la BD. | Cuadro de alerta mostrado; registro eliminado. | Superada |
| **Validación** | Intentar enviar formulario con campos vacíos. | El formulario bloquea el envío y muestra mensajes en rojo. | Alertas visuales activadas por validación reactiva. | Superada |
| **Error** | Detener el backend e intentar recargar el listado. | La interfaz comunica de forma clara el error de conexión. | Banner rojo *"No fue posible conectar con el servidor..."*. | Superada |
| **Persistencia** | Reiniciar servidor Express y base de datos MySQL. | Todos los tickets continúan existiendo tras el reinicio. | Persistencia confirmada al 100%. | Superada |

---

## 8. Declaración de Uso de Inteligencia Artificial (Sección 11 de la pauta)

En cumplimiento de las normas de autoría técnica y transparencia exigidas para esta evaluación:

- **Herramienta utilizada:** Antigravity (asistente de IA para desarrollo).
- **Actividades en las que se utilizó:** 
  - Orientación y estructuración paso a paso del flujo de trabajo y la trazabilidad de Git.
  - Explicación conceptual del funcionamiento de la arquitectura Zoneless en Angular 22 y el uso de `ChangeDetectorRef`.
  - Apoyo en la redacción de plantillas HTML y reglas CSS para el diseño consistente de insignias.
- **Participación, adaptaciones y verificaciones del estudiante:**
  - Creación y ejecución manual de los comandos de la CLI de Angular, npm y base de datos MySQL por consola.
  - Corrección de rutas de importación de modelos (`ticket.models.ts`) y configuración manual de `app.config.ts`.
  - Configuración y validación local de credenciales de MySQL y resolución de incidencias en Git (`git rebase` / `--cached` para remover archivos no deseados).
  - Ejecución, comprobación empírica y prueba individual de cada endpoint REST y componente visual.