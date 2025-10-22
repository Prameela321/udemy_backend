import express, { urlencoded } from 'express'

const app = express();
app.use(express.json());
app.use(urlencoded({extended :true}));
app.use(express.static("public"))

app.use(cors({
    origin : process.env.ORIGINS?.split(',') || "http://localhost:5173",
    credentials : true,
    allowedHeaders : ["Authorization","Content-Type"]
}))
export default app;

