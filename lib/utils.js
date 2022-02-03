module.exports = {
  isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  },

  isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  },

  Length(obj) {
    return Object.keys(obj).length
  }
}