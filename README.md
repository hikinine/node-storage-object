
# node-storage-object
Object cache persistent file based with native javascript Proxy Api approach.


### Credits
This project use the pattern published at [node-storage](https://github.com/amativos/node-storage) project.

### Install

```javascript
npm install node-storage-object
yarn add node-storage-object
```
### How it work

Behaviour is similar to traditional localStorage (key/value).
BUT, instead instance a object and depends on ```set``` and ```get```methods to dealing with the data, 
use your normal object. 
Proxy API intercept any interaction with the object, then internal sync/persist your data.

### Examples:

```javascript
const Storage = require("node-storage-object")

const user = [{
  name: "Jhon",
  lastName: "Mars",
  isDeveloper: false,
  age: 18,
}]

const { store } = new Storage({ 
  filename: "storage/v1.json",
  initialValue: user
})

store.push({
  name: "Anny",
  lastName: "Hans",
  isDeveloper: true,
  age: 19
})

console.log(store)
```

```javascript
const Storage = require("node-storage-object")

const { store } = new Storage({ 
  filename: "storage/v1.json"
})

store.push({
  name: "Carol",
  lastName: "S.",
  isDeveloper: false,
  age: 23
})

console.log(store)
```

### Docs
```javascript
const { store } = new Storage({
    // Required, path where you want to persist your data.
    filename: string,

    // Optional, default = {}.
    // If your file already exist, and any data already exist,
    // initialValue will be ignored.
    initialValue?: object or array,

    // Optional, default = false
    // Parse your data in the file (visual purpose only)
    // Recommend not use this in production for obvious reasons
    beautyJsonParse?: boolean
})
```


