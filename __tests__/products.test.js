const request = require('supertest');
const app = require('../app');

describe('Product API Tests', () => 
{

    beforeEach(() =>
    {
        app.locals.products =
        [
           { id: 1, name: 'Laptop', price: 1000, stock: 5 },
           { id: 2, name: 'Smartphone', price: 600, stock: 10 }
        ];
    });

    describe('GET /products', () =>
    {
        it('should return all products', async () => 
        {
            const res = await request(app).get('/products');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(
            [
                { id: 1, name: 'Laptop', price: 1000, stock: 5 },
                { id: 2, name: 'Smartphone', price: 600, stock: 10 }
            ]);
        });
    });

    describe('GET /products/:id', () => 
    {
        it('should return a product by ID', async () =>
        {
            const res = await request(app).get('/products/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ id: 1, name: 'Laptop', price: 1000, stock: 5 });
        });

        it('should return 404 if product not found', async () =>
        {
            const res = await request(app).get('/products/999');
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Product not found');
        });
    });

    describe('POST /products', () => 
    {
        it('should add a new product', async () => 
        {
            const newProduct = { name: 'Tablet', price: 600, stock: 8 };
            const res = await request(app).post('/products').send(newProduct);
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(
                { id: 3, name: 'Tablet', price: 600, stock: 8 }
            );
        });

        it('should return 400 if product data is missing', async () =>
        {
            const res = await request(app).post('/products').send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Product data is missing');
        });
    
        it('should return 400 if name is missing', async () =>
        {
            const newProduct = { price: 600, stock: 8 };
            const res = await request(app).post('/products').send(newProduct);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Product name is required');
        });
    });

    describe('PUT /products/:id', () =>
    {
        it('should update an existing product', async () =>
        {
           const updatedProduct = { name: 'Laptop', price: 1200, stock: 3 };
           const res = await request(app).put('/products/1').send(updatedProduct);
           expect(res.statusCode).toBe(200);
           expect(res.body).toEqual({ id: 1, name: 'Laptop', price: 1200, stock: 3});
        });
     
        it('should return 404 if product not found', async () =>
        {
           const res = await request(app).put('/products/999').send();
           expect(res.statusCode).toBe(404);
           expect(res.body.message).toBe('Product not found');
        });

        it('should return 400 if no data is provided', async () =>
        {
            const res = await request(app).put('/products/1').send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('No update data provided');
        });
    
        it('should only update provided fields', async () =>
        {
            const updatedProduct = { price: 1300 };
            const res = await request(app).put('/products/1').send(updatedProduct);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ id: 1, name: 'Laptop', price: 1300, stock: 3 });
        });
    });

    describe('DELETE /products/:id', () =>
    {
        it('should delete a product', async () =>
        {
           const res = await request(app).delete('/products/1');
           expect(res.statusCode).toBe(200);
           expect(res.body.message).toBe('Product deleted');
        });
     
        it('should return 404 if product not found', async () =>
        {
           const res = await request(app).delete('/products/999');
           expect(res.statusCode).toBe(404);
           expect(res.body.message).toBe('Product not found');
        });
    });
});
