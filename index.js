import express, { json } from 'express';

import { set, connect } from 'mongoose';
set('strictQuery', false);

import { config } from 'dotenv'
import blogRoutes from './routes/blog';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';

config()

const app = express()
app.use(json())

app.use('/blogs', blogRoutes)
app.use('/users', userRoutes)
app.use('/auth', authRoutes)

const init = async () => {
    connect(process.env.DB_URL).then(res => {

        console.log("DB Connected!");
        app.listen(6000, () => console.log('Listening on 6000'))
    }).catch(error => {

        console.log("\nDatabase connection failed: \n", error)
    })
}

init()