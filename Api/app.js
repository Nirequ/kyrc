const express = require('express');
const cors = require('cors');

const productRouter = require('./routes/Products');
const cartRouter = require('./routes/Cart');
const userRouter = require('./routes/User');

const port = 3000;
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});