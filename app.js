import express from "express"
import morgan from "morgan"
import * as dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/mongoose.config.js"
import userRouter from "./routes/user.routes.js"
import paintingRouter from "./routes/painting.routes.js"
import reviewRouter from "./routes/review.routes.js"

dotenv.config()

const app = express()
const logger = morgan("dev")
app.use(logger)
app.use(express.json())

app.use(
  cors({
    origin: [process.env.REACT_URL],
  })
)

app.use("/user", userRouter)

app.use("/painting", paintingRouter)

app.use("/review", reviewRouter)

app.listen(process.env.PORT, () => {
  console.clear()
  console.log(`Server running on port ${process.env.PORT}`)
  connectDB()
})
