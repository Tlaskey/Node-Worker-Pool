'use strict'

// Largest Prime Number with 9 digits: 999,999,937
// This function is inefficient on purpose.

module.exports.isPrime = (number) => {
    for (let i = 2; i < number; i++) {
        if (number % i == 0) return false
    }
    return true
}