const Storage = require("../lib")

const store = new Storage({ 
  filename: "sample/storage/object.sample.json",
  beautyJsonParse: true
})

store.users = [
  {
    id: 1,
    name: "Paul"
  },
  {
    id: 2,
    name: "Duck"
  }
]

store.products = [
  {
    name: "Keyboard",
    price: 33.5
  },
  {
    name: "Mousepad",
    price: 19.50
  }
]

store.key = "anything..."

store.users.push({
  id: 3,
  name: "Jhon"
})

console.log(store)