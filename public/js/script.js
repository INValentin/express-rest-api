// JS Challenges from andela

// A. Challenge 1

function isPrimeNumber(num) {
    if (num <= 1) return false

    for (let i = 2; i < Math.sqrt(num); i++) {
        if (num % i === 0) return false
    }

    return true
}

function findPrimes(arr) {
    let newArray = []
    for (let i = 0; i < arr.length; i++) {
        const num = arr[i];
        if (isPrimeNumber(num)) {
            newArray.push(num)
        }

    }
}


// 2. Simple array reversing
let arr1 = [1, 2, 3]
arr1.reverse()


// B. Inlined array reversing 

function reverseArray(/** @type {Array} */arr) {
    let leftIndex = 0
    let rightIndex = arr.length - 1

    for (let i = 0; (leftIndex <= rightIndex); i++) {
        let temp = arr[leftIndex]
        arr[leftIndex] = arr[rightIndex]
        arr[rightIndex] = temp

        leftIndex++
        rightIndex--
    }
}


// 4. Format Data


function formatData(data) {
    const result = {}
    data.forEach(item => {
        const [names, age] = item.split(",")
        const [firstName, lastName] = names.split(" ")

        result[firstName.toLocaleLowerCase()] = {
            secondName: lastName,
            age: parseInt(age)
        }
    })
    return result
}

// Test data
const unformattedArray = ['Patrick wyne, 30', 'lil wyne, 32', 'Eric mimi, 21', 'Dodos deck, 21', 'Alian Dwine, 22', 'Patrick wyne, 33', 'Patrick wyne, 100', 'Patrick wyne, 40']

console.log("Format Data")
console.log(formatData(unformattedArray))












