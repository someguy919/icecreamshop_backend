const pg = require('pg');
const cors = require('cors');
const express = require('express');

const app = express();
const PORT = 8080;

app.use(cors());

const connectionString = 'postgres://localhost/ice_cream_shop';
const client = new pg.Client(connectionString);

const init = async () => {
    try {
        await client.connect();
        const SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors (
            id SERIAL PRIMARY KEY,
            name VARCHAR(20)
        );
        INSERT INTO flavors (name) VALUES ('Chocolate');
        INSERT INTO flavors (name) VALUES ('Vanilla');
        INSERT INTO flavors (name) VALUES ('Strawberry');
        INSERT INTO flavors (name) VALUES ('Mint');
        INSERT INTO flavors (name) VALUES ('Fat Free');
        INSERT INTO flavors (name) VALUES ('Sugar Free');
        `;

        await client.query(SQL);
        console.log("Table created!");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

init();

app.get('/api/flavors', async (req, res, next) => {
    try {
        const SQL = 'SELECT * FROM flavors';
        const response = await client.query(SQL);
        console.log(response.rows);
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
});

app.delete('/api/flavors/:id', async (req, res, next) => {
    try {
        const flavorId = req.params.id;
        const SQL = `
        DELETE FROM flavors WHERE id=$1
        `;
        const response = await client.query(SQL, [flavorId]);
        console.log(response);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});
