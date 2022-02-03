const fs = require("fs");
const mkdirp = require("mkdirp");
const {
  waterfall,
  apply,
  queue,
  series,
} = require("async")

const {
  Length,
  isArray,
  isObject
} = require("./utils")

function Storage({ filename = "", initialValue, beautyJsonParse = false}) {
 
  const self = this

  if (typeof filename !== "string" || !filename.length)
    throw new TypeError("Filename as string expected") 

  if (beautyJsonParse) {
    self.beautyJsonParse = true
  }
  self.filename = filename
  self.tempFilename = filename + "~";
  self.backupFilename = filename + "~~";

  self.queue = queue((task, cb) => {
    persist.call(self, function (error) {
      if (error) {
        throw error;
      }
      cb();
    });
  });

  let value = load(initialValue)

  if (!Length(value)) {
    if (initialValue) { 
      value = initialValue 
    }
  }

  self.store = new Proxy(value, validator())
  resolvePath();


  self.sync = async function(force) {
    if (force) 
      (await self.queue.push("sync"))
    else {
      self.queue.idle() && (await self.queue.push("sync"))  
    }
    return    
  }
  function validator() {

    const get = (target, key) => {
      if (isObject(target[key]) && target?.[key] !== null) {
        return new Proxy(target[key], validator());
      }
      return target?.[key];
    };

    const set = (target, key, value) => {
      target[key] = value;
      if (self.queue.idle()) {
        self.queue.push("proxy-set");
      }

      return true;
    };
    const deleteProperty = (target, key) => {
      if (key in target) {
        delete target[key];
        if (self.queue.idle()) {
          self.queue.push("proxy-deleteProperty");
        }
      }
      return true;
    };

    return {
      get,
      set,
      deleteProperty,
    };
  }

  function fileMustNotExist(file, cb) {
    fs.exists(file, function (exists) {
      if (!exists) {
        return cb(null);
      }
      fs.unlink(file, function (err) {
        return cb(err);
      });
    });
  }

  function writeData(filename, data, cb) {
    let _fd

    waterfall(
      [
        apply(fs.open, filename, "w"),

        function (fd, cb) {
          _fd = fd;
          var buffer = Buffer.from(data);
          var offset = 0;
          var position = 0;

          fs.write(fd, buffer, offset, buffer.length, position, cb);
        },

        function (written, buf, cb) {
          fs.fsync(_fd, cb);
        },

        function (cb) {
          fs.close(_fd, cb);
        },
      ],
      function (err) {
        cb(err);
      }
    );
  }
  function doBackup(cb) {

    fs.exists(self.filename, function (exists) {
      if (!exists) {
        return cb(null);
      }

      fs.rename(self.filename, self.backupFilename, cb);
    });
  }

  function resolvePath() {
    const _path = self.filename.split("/").slice(0, -1).join("/");
    _path && mkdirp.sync(_path);
  }
  function persist(cb) {

    let data

    if (self.beautyJsonParse) {
      data = JSON.stringify(self.store, null, 2);
    }
    else {
      data = JSON.stringify(self.store)
    }

    series(
      [
        apply(fileMustNotExist, self.tempFilename),
        apply(fileMustNotExist, self.backupFilename),
        apply(doBackup.bind(self)),
        apply(writeData.bind(self), self.tempFilename, data),
        apply(fs.rename, self.tempFilename, self.filename),
        apply(fileMustNotExist, self.backupFilename),
      ],
      cb
    );
  }

  function load(initialValue) {
    const filename = self.filename
    const cb = () => {}

    try {
      const fileData = fs.readFileSync(filename).toString();
      return JSON.parse(fileData);          
    } 
    catch (e) {
      if (e?.code !== "ENOENT") { throw e; }

      try {
        if (!initialValue) {
          throw Error("undefined initial value. Start as {} or []")
        }
        writeData(filename, JSON.stringify(initialValue), cb)
        return initialValue        
      } 
      catch (error) {
        const value = initialValue !== undefined
          ? isArray(initialValue)
            ? []
            : {}
          : {};
        writeData(filename, JSON.stringify(value), cb)
        return value
      }
    }
  }
}

module.exports = Storage