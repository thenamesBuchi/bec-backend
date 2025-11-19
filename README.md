# BEC Backend - Node.js + Express + MongoDB

A RESTful API backend for the BEC Course Marketplace.

## Project Structure

```
bec-backend/
├── models/
│   ├── Course.js       (Course schema)
│   └── Order.js        (Order schema)
├── routes/
│   ├── courses.js      (GET, POST, PUT, DELETE courses)
│   ├── orders.js       (GET, POST, PUT orders/checkout)
│   └── health.js       (Health check endpoint)
├── .env                (Environment variables)
├── server.js           (Express app entry point)
└── package.json        (Dependencies)
```

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB

#### Option A: Local MongoDB (Recommended for Development)
- **Install MongoDB Community Edition**: https://docs.mongodb.com/manual/installation/
- **Start MongoDB server**:
  - **Windows**: `mongod`
  - **macOS/Linux**: `brew services start mongodb-community`
- Default connection: `mongodb://localhost:27017/bec-courses`

#### Option B: MongoDB Atlas (Cloud - Free Tier)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
4. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bec-courses
   ```

### 3. Run the Server

**Development** (with auto-reload via nodemon):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Courses

**Get all courses**
```
GET /api/courses
```

**Get single course**
```
GET /api/courses/:id
```

**Create course**
```
POST /api/courses
Body: {
  "title": "Web Development 101",
  "author": "John Doe",
  "price": 29.99,
  "spaces": 30,
  "imageUrl": "https://...",
  "category": "Programming"
}
```

**Update course (e.g., reduce spaces)**
```
PUT /api/courses/:id
Body: { "spaces": 25 }
```

**Delete course**
```
DELETE /api/courses/:id
```

### Orders (Checkout)

**Get all orders**
```
GET /api/orders
```

**Get single order**
```
GET /api/orders/:id
```

**Create order (Checkout)**
```
POST /api/orders
Body: {
  "customerName": "Jane Smith",
  "customerPhone": "+1234567890",
  "customerEmail": "jane@example.com",
  "items": [
    {
      "courseId": "ObjectId",
      "title": "Web Development 101",
      "price": 29.99,
      "quantity": 1
    }
  ],
  "totalPrice": 29.99
}
```
- Automatically reduces course spaces
- Marks order as "completed"

**Update order status**
```
PUT /api/orders/:id
Body: { "status": "cancelled" }
```

## Seed Database (Optional)

To quickly populate courses, run this in MongoDB shell or MongoDB Compass:

```javascript
db.courses.insertMany([
  { title: "Web Dev 101", author: "John Doe", price: 29.99, spaces: 30 },
  { title: "Python Basics", author: "Jane Smith", price: 24.99, spaces: 25 },
  { title: "React Advanced", author: "Bob Johnson", price: 39.99, spaces: 20 },
  { title: "Node.js Mastery", author: "Alice Brown", price: 34.99, spaces: 28 },
  { title: "Vue.js Essentials", author: "Charlie Davis", price: 27.99, spaces: 32 },
  { title: "CSS Grid & Flexbox", author: "Eve Wilson", price: 19.99, spaces: 40 },
  { title: "JavaScript ES6+", author: "Frank Miller", price: 31.99, spaces: 22 },
  { title: "TypeScript Pro", author: "Grace Lee", price: 37.99, spaces: 18 },
  { title: "Database Design", author: "Henry Martinez", price: 41.99, spaces: 15 },
  { title: "API Development", author: "Iris Lopez", price: 33.99, spaces: 26 }
])
```

## Frontend Integration

Update your Vue frontend to call these endpoints. Example using `fetch`:

```javascript
// Get all courses
fetch('http://localhost:5000/api/courses')
  .then(res => res.json())
  .then(data => console.log(data))

// Create order (checkout)
fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'Jane Smith',
    customerPhone: '+1234567890',
    items: [...],
    totalPrice: 59.98
  })
})
.then(res => res.json())
.then(order => console.log('Order created:', order))
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/bec-courses` | MongoDB connection string |
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment mode |

## Troubleshooting

**MongoDB not connecting?**
- Ensure MongoDB is running (`mongod` command)
- Check `MONGO_URI` in `.env` is correct
- For MongoDB Atlas, verify connection string and IP whitelist

**CORS errors?**
- Frontend must be on different port (e.g., 3000 or file://)
- CORS is already enabled in `server.js`

**Module not found errors?**
- Run `npm install` again
- Delete `node_modules/` and `.package-lock.json`, then reinstall

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Set up MongoDB (local or Atlas)
3. ✅ Run server: `npm run dev`
4. ✅ Test endpoints in Postman or browser
5. ✅ Update frontend to fetch from `http://localhost:5000/api/courses`
6. ✅ Implement checkout flow to POST to `/api/orders`
