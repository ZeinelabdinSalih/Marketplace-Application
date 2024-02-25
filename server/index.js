const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Assuming environment variables are set in your operating system or deployment environment
const dbConnectionString = process.env.DB_CONNECTION_STRING || 'mongodb+srv://zsalih1:vG38Zg4RboHCHxmf@cluster0.ycgtolz.mongodb.net/Marketplace?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    category: String
});

// Product Model
const Product = mongoose.model("Product", ProductSchema);

// Get all Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get Product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add new Product
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update Product by ID
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Remove Product by ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

// Remove all Products
app.delete('/api/products', async (req, res) => {
    try {
        await Product.deleteMany({});
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

// Find all Products which name contains a keyword

app.get('/api/products', async (req, res) => {
    try {
        // Extract the 'name' query parameter
        const { name } = req.query;
        
        // Construct the query object based on the presence of 'name'
        const query = name ? { name: { $regex: new RegExp(name, 'i') } } : {}; // Case-insensitive search

        // Execute the query
        const products = await Product.find(query);

        // Respond with the matched products
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// app.get('/api/products/search', async (req, res) => {
//     try {
//         const keyword = req.query.keyword;
//         const productsbyname = await Product.find({ $name: { $regex: req.query.keyword, $options: 'i' } });

//         res.json(productsbyname);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });


// Welcome message for the root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to DressStore application.' });
});

// Set the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// '''
// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();

// // Assuming environment variables are set in your operating system or deployment environment
// const dbConnectionString = process.env.DB_CONNECTION_STRING || 'mongodb+srv://zsalih1:vG38Zg4RboHCHxmf@cluster0.ycgtolz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connection established'))
//   .catch(err => console.error('MongoDB connection error:', err));

// const ProductSchema = new mongoose.Schema({
//     name: String,
//     description: String,
//     price: Number,
//     quantity: Number,
//     category: String
// });

// const ProductModel = mongoose.model("Product", ProductSchema);

// app.get('/', (req, res) => {
//     res.json({ message: 'Welcome to DressStore application.' });
// });

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
