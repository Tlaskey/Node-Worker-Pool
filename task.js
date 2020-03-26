'use strict'
const {wrapAsWorker} = require('./worker-pool')
const {isPrime} = require('./isPrime')

wrapAsWorker(isPrime)
