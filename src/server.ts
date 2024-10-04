import cors from "cors"
import express from "express"
import { router } from "./routes"
import { errorHandlerMiddleware } from "./middlewares/error-handler"

const app = express()
app.use(cors())
app.use(router)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor iniciado em: http://localhost:${PORT}/`)
})