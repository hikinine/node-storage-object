const Storage = require("../lib")

const { store } = new Storage({ 
  filename: "sample/storage/array.sample.json",
  initialValue: [],
})

store.push(
  {
    id: 1,
    name: "Jhon",
    age: 25
  }, 
)
store.push(
  {
    id: 2,
    name: "Math",
    age: 15
  },
)

console.log(store)