# mnk ink

> Sitio web premium y experiencia de reservas para estudio de tatuajes, pensado para mostrar el trabajo artístico, reforzar la identidad de marca y gestionar turnos con disponibilidad real.

## Descripción general

**mnk ink** es un proyecto web moderno creado para darle a una marca de tatuajes una presencia digital más sólida. La idea no es solo mostrar trabajos, sino construir una experiencia completa alrededor del estudio: identidad visual, portfolio, confianza y una reserva de turnos fluida.

El proyecto combina una **experiencia frontend cuidada** con un **backend en .NET** integrado con **Google Calendar**, permitiendo que los usuarios vean fechas disponibles y reserven turnos con validación en tiempo real.

---

## Por qué existe este proyecto

Muchas webs de tatuajes se quedan en una galería simple o en un puente hacia Instagram. Este proyecto fue pensado para ir más allá:

- mostrar el trabajo del artista de una forma profesional y memorable
- comunicar la personalidad de la marca
- mejorar el flujo de reservas con disponibilidad real
- reducir la fricción de la gestión manual de agenda
- funcionar como un proyecto de portfolio sólido que combine diseño y desarrollo

---

## Funcionalidades principales

### Frontend
- Experiencia de **Home** premium con una identidad de marca más fuerte
- **Navbar** y **Footer** rediseñados
- **Gallery** con filtros por categoría y vista de detalle en modal
- Sección **About** más pulida
- Página de turnos con:
  - selección de fecha
  - horarios realmente disponibles
  - flujo de confirmación
  - experiencia de usuario más limpia

### Backend
- API REST construida con **.NET**
- Integración con Google Calendar
- Consulta de disponibilidad real
- Creación de turnos sincronizada con eventos del calendario

---

## Stack tecnológico

### Frontend
- Angular
- TypeScript
- HTML / SCSS
- Arquitectura basada en componentes

### Backend
- .NET
- API REST
- Google Calendar API

---

## Estructura del proyecto

```bash
mnk-ink/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── shared/
│   │   │   ├── features/
│   │   │   │   ├── home/
│   │   │   │   ├── gallery/
│   │   │   │   ├── about/
│   │   │   │   └── booking/
│   │   ├── assets/
│   │   └── environments/
│   └── package.json
│
└── backend/
    ├── Controllers/
    ├── Services/
    ├── Models/
    ├── appsettings.json
    └── Program.cs
```

> La estructura exacta puede variar según el estado actual del proyecto.

---

## Primeros pasos

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd mnk-ink
```

### 2. Ejecutar el frontend

Instalar dependencias:

```bash
npm install
```

Levantar el servidor de desarrollo:

```bash
ng serve
```

o, según la configuración actual:

```bash
npm start
```

URL local por defecto:

```bash
http://localhost:4200
```

### 3. Ejecutar el backend

```bash
dotnet restore
dotnet run
```

---

## Configuración de entorno

Según cómo esté armado el proyecto, puede ser necesario configurar lo siguiente.

### Frontend
Definir la URL base de la API en los archivos de entorno.

Ejemplo:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001'
};
```

### Backend
Configurar:

- credenciales de Google Calendar
- Calendar ID
- configuración de CORS
- valores en `appsettings`

Ejemplo:

```json
{
  "GoogleCalendar": {
    "CalendarId": "tu-calendar-id",
    "CredentialsPath": "credentials.json"
  }
}
```

---

## Flujo de turnos

El flujo general de reserva funciona así:

1. El usuario entra a la página de turnos
2. Selecciona una fecha
3. El frontend pide horarios disponibles al backend
4. El backend valida la disponibilidad real
5. Se confirma el turno
6. El turno se crea en Google Calendar

Esto ayuda a evitar superposiciones y hace que la gestión de agenda sea mucho más confiable.

---

## Estado actual del proyecto

### Implementado
- Backend en .NET integrado con Google Calendar
- Flujo de turnos en Angular conectado al backend
- Página de turnos rediseñada con disponibilidad real y confirmación
- Sección Home premium
- Gallery con filtros y modal
- Sección About rediseñada
- Navbar y Footer premium

### Próximos pasos
- Microanimaciones y detalles de movimiento sutil
- Landing más fuerte a nivel presentación
- Página tipo case study para portfolio
- Ajustes extra de UX/UI
- Deploy a producción

---

## Dirección visual

La dirección visual del proyecto busca transmitir una sensación:

- premium
- oscura y de alto contraste
- artística
- atmosférica
- moderna, pero con personalidad

La intención es construir una experiencia digital alineada con el peso visual y emocional del tatuaje, en lugar de que se sienta como una plantilla genérica.

---

## Posibles mejoras futuras

Algunas próximas iteraciones pueden incluir:

- panel de administración de turnos
- reglas automáticas de bloqueo de horarios
- mails de confirmación
- recordatorios automáticos
- carga dinámica de trabajos desde API
- dashboard de reservas
- analíticas
- mejoras SEO

---

## Scripts útiles

### Frontend

```bash
npm install
ng serve
ng build
npm run build
```

### Backend

```bash
dotnet restore
dotnet build
dotnet run
```

---

## Valor para portfolio

Este proyecto también funciona como un caso sólido para mostrar:

- desarrollo frontend
- integración con backend
- criterio de UI/UX
- consumo de APIs
- integración con servicios externos
- resolución de una necesidad real de negocio con un producto cuidado de cara al usuario

---

## Autor

Desarrollado por **Tadeo Monaco** para **mnk ink**.

---

## Nota final

Este proyecto sigue en evolución, pero la base funcional ya está armada. La próxima etapa apunta al pulido visual, las microinteracciones, la presentación y la preparación del producto para una publicación más sólida.
