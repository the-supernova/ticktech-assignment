import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'


const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
