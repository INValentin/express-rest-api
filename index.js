import express, { json } from 'express';

import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan';

import swaggerDocument from './documentation/swagger.json' assert { type: "json" };

mongoose.set('strictQuery', false);

import { config } from 'dotenv'
import blogRoutes from './routes/blog';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact'


const PORT = process.env.NODE_ENV === 'test' ? 5017 : (
    process.env.PORT || 5000
)

config()
console.log(process.env.DB_URL)

const app = express()
app.use(json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

if (process.env.NODE_ENV === 'test') {
    app.use(morgan('combined'));
}

app.use('/blogs', blogRoutes)
app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/contacts', contactRoutes)

const init = async () => {
    mongoose.connect(process.env.DB_URL).then(res => {
        console.log("DB Connected!");
        app.listen(PORT, () => console.log('Listening on ' + PORT))
    }).catch(error => {
        console.log("\nDatabase connection failed: \n", error)
    })
}

await init()


export default app