'use strict';

const express = require('express');
const udRoute = express.Router();
const connection = require('../db');


udRoute.put('/users/:uid', function (req, res, next) {
    const { name, username, password, email, tel, position, affiliation } = req.body;
    const { uid } = req.params;

    // Validate inputs
    if (!name || !password) { 
        console.error('Validation error: Name and password are required.');
        return res.status(400).send("Name and password are required.");
    }

    // Encode the password in Base64
    const encodedPassword = Buffer.from(password).toString('base64');

    connection.execute(
        "UPDATE profile SET name=?, username=?, password=?, email=?, tel=?, position=?, affiliation=? WHERE id=?;",
        [name, username, encodedPassword, email, tel, position, affiliation, uid]
    ).then(() => {
        console.log(`User with ID ${uid} updated successfully`);
        res.status(200).send("Update Successfully.");
    }).catch((err) => {
        console.error('Error updating user:', err);
        res.status(500).send("Error updating user.");
    });
});




udRoute.delete('/users/:uid', function (req, res, next) {
    const { uid } = req.params;

    connection.execute(
        "DELETE FROM profile WHERE id=?;",
        [uid]
    ).then(() => {
        console.log(`User with ID ${uid} deleted successfully`);
        res.status(200).send("Delete Successfully.");
    }).catch((err) => {
        console.error('Error deleting user:', err);
        res.status(500).send("Error deleting user.");
    });
});

udRoute.use('/', function (req, res, next) {
    res.sendStatus(404);
});

module.exports = udRoute;
