## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/attmas_full_project.git
cd attmas_full_project
```

2. Install dependencies:

#### Backend
```sh
cd backend/attmas_backend
npm install
```

#### Frontend
```sh
cd ../../frontend/attmas_frontend
npm install
```

### Running the project

#### Backend
```sh
cd backend/attmas_backend
npm run start:dev
```

#### Frontend
```sh
cd ../../frontend/attmas_frontend
npm run dev
```

### Building the project

#### Backend
```sh
cd backend/attmas_backend
npm run build
npm start
```

#### Frontend
```sh
cd ../../frontend/attmas_frontend
npm run build
npm start
```

### Linting the project

#### Frontend
```sh
cd frontend/attmas_frontend
npm run lint
```

## Redis setup in ubuntu

1. step: sudo apt update && sudo apt upgrade -y

2. step: sudo apt install redis-server -y

3. step: sudo systemctl start redis

4. step: sudo systemctl enable redis

5. step: sudo systemctl status redis

6. step: sudo nano /etc/redis/redis.conf

7. step: changes: bind 0.0.0.0 { requirepass your-strong-password }

8. step: sudo systemctl restart redis

9. step: redis-cli

10. step: ping = pong
