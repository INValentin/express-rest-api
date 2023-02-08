import express, { json } from 'express';

import mongoose from 'mongoose';
// import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan';
import { Swaggiffy, registerDefinition } from 'swaggiffy';
// import swaggerDocument from './documentation/swagger.json' assert { type: "json" };
import cors from 'cors'

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
// console.log(process.env.DB_URL

const app = express()
app.use(cors())
app.use(json())

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

if (process.env.NODE_ENV === 'test') {
    app.use(morgan('short'));
}

app.use(express.static("public"));

app.use('/blogs', blogRoutes)
app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/contacts', contactRoutes)


const init = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("DB Connected!");
        app.listen(PORT, () => {
            console.log('Listening on ' + PORT)
        
            registerDefinition(authRoutes, { tags: 'Auth', mappedSchema: 'Auth', basePath: '/auth' })
            registerDefinition(blogRoutes, { tags: 'Blogs', mappedSchema: 'Blog', basePath: '/blogs' })
            registerDefinition(userRoutes, { tags: 'Users', mappedSchema: 'User', basePath: '/users' })
            registerDefinition(contactRoutes, { tags: 'Contacts', mappedSchema: 'Contact', basePath: '/contacts' })
            new Swaggiffy().setupExpress(app).setupPort(PORT).swaggiffy();
        })
        
    } catch (error) {
        
        console.log("\nDatabase connection failed: \n", error)
    }
}

await init()



// app.use('*', (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'public/index.html'));
// })

export default app