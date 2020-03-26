'use strict'
const {WorkerPool} = require('./worker-pool')
const express = require('express')

const app = express()

const pool = new WorkerPool('./task.js')

app.get('/:number', (req, res) => {
    pool.sendWork(req.params.number, (err, result) => {
        if (err) return console.error(err)
        return res.status(200).send(result)
    })
})

app.listen(3000)
console.log('Listening on port 3000...')