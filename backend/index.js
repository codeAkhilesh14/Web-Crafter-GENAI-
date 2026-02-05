const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const OpenAIRouter = require('./Routes/OpenAIRouter');

require('dotenv').config();
// console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY);
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
    origin: "https://web-crafter-genai.onrender.com", // kaha se req aa rha h
    credentials: true
}))
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/api/openai', OpenAIRouter);


app.listen(PORT, () => {

    console.log(`Server is running on ${PORT}`)
})
