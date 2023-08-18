const express = require('express');
const router = require('./Routes/Routes');
const app = express(); // initialize express app

app.use(express.json()); // parse requests of content-type - application/json
app.use('/api', router); 
app.use((err, req, res, next) => {
    res.json({
        error: err.message
        })
    })


// define a port
app.listen(8005, () => {
    console.log('Server is listening on port 8005');
});

// base route: http://localhost:8005/