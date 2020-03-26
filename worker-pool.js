'use strict'
const {Worker, MessageChannel, parentPort} = require('worker_threads')
const os = require('os')

const WORKER_STATUS = {
    IDLE: 'idle',
    BUSY: 'busy'
}

module.exports.WorkerPool = class WorkerPool {
    constructor(script) {
        this.script = script
        this.size = os.cpus().length
        this.pool = []
        this.initialize()
    }

    initialize() {
        for (let i = 0; i < this.size; i++) {
            const worker = new Worker(this.script)
            this.pool.push({status: WORKER_STATUS.IDLE, worker})
            worker.once('exit', () => {
                worker.emit(`worker ${worker.threadId} terminated`)
            })
        }
    }

    getIdleWorker() {
        const idleWorker = this.pool.find(w => w.status === WORKER_STATUS.IDLE)
        if (idleWorker) return idleWorker.worker
        // If no idle worker found, return random worker.
        return this.pool[Math.ceil(Math.random() * this.size)].worker
    }

    setWorkerIdle(worker) {
        const currWorker = this.pool.find(w => w.worker === worker)
        if (currWorker) currWorker.status = WORKER_STATUS.IDLE
    }

    setWorkerBusy(worker) {
        const currWorker = this.pool.find(w => w.worker === worker)
        if (currWorker) currWorker.status = WORKER_STATUS.BUSY
    }

    sendWork(data, callback) {
        const worker = this.getIdleWorker()
        this.setWorkerBusy(worker)
        const {port1, port2} = new MessageChannel()

        worker.postMessage({data, port: port1}, [port1])
        port2.once('message', (result) => {
            this.setWorkerIdle(worker)
            callback(null, result)
        })
        port2.once('error', (err) => {
            this.setWorkerIdle(worker)
            callback(err)
        })
    }
}

module.exports.wrapAsWorker = (workerFunc) => {
    parentPort.on('message', ({data, port}) => {
        const result = workerFunc(data)
        port.postMessage(result)
    })
}