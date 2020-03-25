const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

if (isMainThread) {
    // Parent thread
    
} else {
    // Workers execute this
}