'use strict'
const {WorkerPool} = require('./worker-pool')
const express = require('express')

const app = express()

// Setup Worker pool with 4 threads.
const pool = new WorkerPool('./task.js', 4)

app.get('/:number', (req, res) => {
    console.log('Calculating isPrime for', req.params.number)
    pool.sendWork(req.params.number, (err, result) => {
        if (err) return console.error(err)
        return res.status(200).send(result)
    })
})

app.listen(3000)
console.log('Listening on port 3000...')