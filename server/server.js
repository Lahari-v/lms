// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config' 
// import connectDB from './configs/mongodb.js'
// import { clerkWebhooks } from './controllers/webhooks.js'


// //Initialize Express
// const app = express()

// //Connect to database
// await connectDB()

// //Middleware
// app.use(cors())

// //Routes
// app.get('/', (req, res)=> res.send("API Working"))
// app.post('/clerk', express.json(), clerkWebhooks)

// //Port
// const PORT = process.env.PORT || 5000

// app.listen(PORT, ()=>{
//     console.log(`Server is running on port ${PORT}`)
// })

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

// Initialize Express
const app = express()

// Connect to MongoDB
await connectDB()

// CORS middleware
app.use(cors())


// ⚠️ Clerk webhook must comze before express.json() for raw body
app.post('/clerk', express.raw({ type: '*/*' }), clerkWebhooks)

// Normal JSON body parser for other routes
app.use(express.json())

// Route for testing
app.get('/', (req, res) => {
  res.send("API Working")
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
