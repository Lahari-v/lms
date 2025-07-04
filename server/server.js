import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'
import bodyParser from 'body-parser'


// Initialize Express
const app = express()

// Connect to MongoDB
await connectDB()
await connectCloudinary()
 
app.use(cors())

 
app.post('/clerk', express.raw({ type: '*/*' }), clerkWebhooks) 

app.post('/stripe', bodyParser.raw({ type: 'application/json' }), stripeWebhooks);

app.use(clerkMiddleware())
app.use(express.json()) 

app.get('/', (req, res) => {
  res.send("API Working")
})

app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)  

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
