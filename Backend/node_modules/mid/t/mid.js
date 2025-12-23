var test = require('tape')
  , mid = require('../mid')

test('middleware', function (t) {
  var stack1 = [ add(2), add(10) ]
    , first = mid(stack1)
    , obj1 = {val: 1}
    , obj2 = {val: 10}
    , obj3 = {val: 100}
    , arr1 = range(100)
    , second = mid()
    , mix = {val: 1}

  t.plan(11)

  t.equal(stack1, first._stack, '_stack')

  first(obj1, obj2, obj3, function (err) {
    t.notOk(err, 'First no error')
    t.equal(obj1.val, 13, 'obj1 adds')
    t.equal(obj2.val, 22, 'obj2 adds')
    t.equal(obj3.val, 112, 'obj3 adds')
  })

  second.use(rep(3, 'fizz'))
  second.use(rep(5, 'buzz'))
  second(arr1, function (err) {
    t.equal(arr1[33], 'fizz', 'fizz')
    t.equal(arr1[55], 'buzz', 'buzz')
    t.equal(arr1[56], 56, 'num')
  })

  mid(mix)
  mix.use(function (num, next) {
    this.val += num
    next()
  })
  mix.exec(10, function (err) {
    t.equal(mix.val, 11, 'Mixin middleware 1')
  })
  mix.exec(100, function (err) {
    t.equal(mix.val, 111, 'Mixin middleware 2')
  })
  mix.exec(1000, function (err) {
    t.equal(mix.val, 1111, 'Mixin middleware 3')
  })

})

// Work for tests

function rep (num, str) {
  return function (arr, done) {
    arr.forEach(function (i, idx) {
      var s = ''
      if (typeof i === 'string') s = i
      if (idx === 0) return
      else if (idx/num === Math.floor(idx/num)) arr[idx] = s + str
    })
    done()
  }
}

function range (num) {
  var arr = []
  while (num) {
    num--
    arr[num] = num
  }
  return arr
}

function add (a) {
  return function (b, c, d, next) {
    b.val += a
    c.val += a
    d.val += a
    next()
  }
}
