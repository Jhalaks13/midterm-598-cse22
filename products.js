
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Products API!');
});

app.use(express.json());

let products = [];
let nextId = 1;

// 1. POST - Add a new product
app.post('/api/products', (req, res) => {
    const { name, price, category } = req.body;

    if (!name || price === undefined || !category ||
        typeof name !== 'string' ||
        typeof price !== 'number' ||
        typeof category !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid data' });
    }

    const exists = products.find(
        p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        return res.status(409).json({ message: 'Product already exists' });
    }

    const product = {
        id: nextId++,
        name,
        price,
        category
    };

    products.push(product);

    res.status(201).json({
        message: 'Product added successfully',
        product
    });
});


app.get('/api/products', (req, res) => {
    let result = products;

    if (req.query.category) {
        result = products.filter(
            p => p.category.toLowerCase() === req.query.category.toLowerCase()
        );
    }

    res.status(200).json(result);
});


app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
});

// 4. PUT - Update product by ID
app.put('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, price, category } = req.body;

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (!name || price === undefined || !category ||
        typeof name !== 'string' ||
        typeof price !== 'number' ||
        typeof category !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid data' });
    }

    const exists = products.find(
        p => p.name.toLowerCase() === name.toLowerCase() && p.id !== id
    );

    if (exists) {
        return res.status(409).json({ message: 'Product name already exists' });
    }

    product.name = name;
    product.price = price;
    product.category = category;

    res.status(200).json({
        message: 'Product updated successfully',
        product
    });
});


app.delete('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const deleted = products.splice(index, 1);

    res.status(200).json({
        message: 'Product deleted successfully',
        product: deleted[0]
    });
});


const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to Products API Server!');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
