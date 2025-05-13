# Weather Wizard

A weather application built with React, Express, and PostgreSQL.

## Setup Instructions

### Prerequisites
- Node.js (v14 or newer)
- PostgreSQL installed locally or a Neon database account

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```
# Database URL - You need to use your own PostgreSQL database
DATABASE_URL=postgres://username:password@localhost:5432/weather_wizard

# OpenWeatherMap API Key - Get from https://openweathermap.org/api
OPENWEATHERMAP_API_KEY=your_api_key_here
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file as described above
4. Run the development server:
   ```
   npm run dev
   ```

The application will be available at http://localhost:5000

### Build for Production

```
npm run build
npm run start
```

## Project Structure

- `client/` - React frontend
- `server/` - Express backend
- `shared/` - Shared types and utilities

## Output
