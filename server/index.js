const express = require('express');
const app = express();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user:"root",
    password:"140217",
    database:"invernadero"
});

app.listen(3000, () => {
    console.log('Corriendo en el puerto 3000')
})
 