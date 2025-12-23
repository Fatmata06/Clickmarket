===============================================================================
Mid.js
===============================================================================

Super simple middleware!

mid(stack, obj)
===============

Create a new middleware, both the stack array and object to be mixed into
are optional. Returns obj, or the exec function itself.

middleware.exec(args..., cb)
=====================

Call each function in the stack with the arguments. cb is called with no
arguments when the stack finishes, or with an error when if/when one occurs.

middleware.use(fn)
==================

Add fn to the middleware's stack.

middleware._stack
=================

The actual array of functions that the middleware uses as a stack,
exposed in case you want to do something crazy and undocumented/untested.
