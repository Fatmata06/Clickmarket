// mid.js
module.exports = function (stack, o) {
  if (!Array.isArray(stack)) {
    o = stack
    stack = []
  }
  if (!o || typeof o !== 'object') o = exec

  function use (fn) {
    stack.push(fn)
    return this
  }

  function exec () {
    var args = Array.prototype.slice.call(arguments, 0)
      , cb = args.pop()
      , self = this
    if (!(stack.length >= 1)) return cb()
    run(0)

    function run (num) {
      if (num === stack.length) return cb()

      stack[num].apply(self, args.concat(next(num)))

    }

    function next (num) {
      num += 1
      return function (err) {
        if (err) return cb(err)
        run(num)
      }
    }
  }

  o.use = use
  o.exec = exec
  o._stack = stack

  return o
}

