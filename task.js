'use strict'
const {wrapAsWorker} = require('./worker-pool')
const {isPrime} = require('./isPrime')

// Wrap a worker with isPrime function.
wrapAsWorker(isPrime)
