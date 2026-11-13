# Lost and Found

Campus Connect is a comprehensive campus utility web application featuring lost-and-found listings, study material sharing, and attendance tracking. 

The project is structured as a monorepo that integrates a React (Vite) frontend with an Express and MongoDB backend.

## 🛠 Tech Stack
* **Frontend:** React, Vite[cite: 4, 6]
* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas
* **Linting:** Oxlint (configured with `react` and `oxc` plugins)
* **Task Runner:** Concurrently

## 📂 Project Structure
* `client/`: Contains the Vite-based React frontend app.
* `server/`: Contains the Express server and API routes[cite: 4].
* Root: Holds shared configurations, the main `package.json`[cite: 4], and `.gitignore`.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* MongoDB Atlas account or local MongoDB instance

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/SathvikBaratam/lost_found.git](https://github.com/SathvikBaratam/lost_found.git)
   cd lost_found
