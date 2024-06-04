---
layout: page
title: ZeroMQ
permalink: /docs/0.10.0/quickjs/zeromq/
---

# ZeroMQ

[`ZeroMQ`](https://zeromq.org/) enables
[`ffgac`](../ffgac),
[`ffedit`](../ffedit), and
[`fflive`](../fflive)
to do many kinds of network communication and messaging.

A global constructor `ZMQ()` is built-in to the `quickjs` engine.
This is a simple wrapper around `ZeroMQ` functionality.

This page is mostly based on the [`ZMQ` API reference](https://libzmq.readthedocs.io/en/latest/) itself.

**NOTE**: The `FFglitch` `ZeroMQ` interface is **still high experimental**.
          It may change wildly without warning in newer versions.

<hr />
## ZMQ Constructor
The `new ZMQ()` constructor is used to create a new `ZMQ` object.

This is a wrapper around `zmq_ctx_new()` and `0MQ context`.

### Syntax
```js
new ZMQ()
```

### Return value
The new `ZMQ` object.

### Examples
```js
const zmq = new ZMQ();
```

<hr />
## ZMQ.prototype.socket()
This is a wrapper around [zmq_socket()](https://libzmq.readthedocs.io/en/latest/zmq_socket.html).

**NOTE**: The resulting socket object is kept internally in the `ZMQ`
          object because I still didn't figure out a way to cleanup
          properly without this hack.

### Syntax
```js
socket(type)
```

### Parameters
The `type` argument specifies the socket type, which determines the semantics of communication over the socket.

The types are available in the global `ZMQ` object, i.e.: `ZMQ.ZMQ_REQ`.

### Return value
The new `ZMQSocket` object or an exception.

### Examples
```js
const zmq = new ZMQ();
const zreq = zmq.socket(ZMQ.ZMQ_REQ);
```

<hr />
## ZMQ.prototype.set()
This is a wrapper around [zmq_ctx_set()](https://libzmq.readthedocs.io/en/latest/zmq_ctx_set.html).

### Syntax
```js
set(option_name, option_value)
```

### Parameters
The `zmq_ctx_set()` function shall set the option specified by the
`option_name` argument to the value of the `option_value` argument.

The option names are available in the global `ZMQ` object, i.e.: `ZMQ.ZMQ_BLOCKY`.

### Return value
`0` on success, ortherwise an exception.

### Examples
```js
const zmq = new ZMQ();
zmq.set(ZMQ.ZMQ_BLOCKY, 0);
```

<hr />
## ZMQ.prototype.get()
This is a wrapper around [zmq_ctx_get()](https://libzmq.readthedocs.io/en/latest/zmq_ctx_get.html).

### Syntax
```js
get(option_name)
```

### Parameters
The `zmq_ctx_get()` function shall return the option specified by the
`option_name` argument.

The option names are available in the global `ZMQ` object, i.e.: `ZMQ.ZMQ_BLOCKY`.

### Return value
`0` on success, ortherwise an exception.

### Examples
```js
const zmq = new ZMQ();
const max_msg_size = zmq.get(ZMQ.ZMQ_MAX_MSGSZ);
```

<hr />
## ZMQ.prototype.shutdown()
This is a wrapper around [zmq_ctx_shutdown()](https://libzmq.readthedocs.io/en/latest/zmq_ctx_shutdown.html).

### Syntax
```js
shutdown()
```

### Return value
`0` on success, ortherwise an exception.

### Examples
```js
const zmq = new ZMQ();
zmq.shutdown();
```

<!--
TODO
static const JSCFunctionListEntry js_ZMQ_obj[] = {
    JS_CFUNC_DEF("version", 0, js_ZMQ_version),
    JS_CFUNC_DEF("has", 1, js_ZMQ_has),
    /* 0MQ errors */
-->

<hr />
## ZMQSocket.prototype.bind()
This is a wrapper around [zmq_bind()](https://libzmq.readthedocs.io/en/latest/zmq_bind.html).

### Syntax
```js
bind(endpoint)
```

### Parameters
The `endpoint` is a string consisting of a `transport://` followed by an `address`.
The `transport` specifies the underlying protocol to use.
The `address` specifies the transport-specific address to bind to.

### Return value
`0` on success, ortherwise an exception.

### Examples
(sorry, I haven't tested this)

<hr />
## ZMQSocket.prototype.unbind()
This is a wrapper around [zmq_unbind()](https://libzmq.readthedocs.io/en/latest/zmq_unbind.html).

### Syntax
```js
unbind(endpoint)
```

### Parameters
The `endpoint` is a string consisting of a `transport://` followed by an `address`.
The `transport` specifies the underlying protocol to use.
The `address` specifies the transport-specific address to unbind from.

### Return value
`0` on success, ortherwise an exception.

### Examples
(sorry, I haven't tested this)

<hr />
## ZMQSocket.prototype.connect()
This is a wrapper around [zmq_connect()](https://libzmq.readthedocs.io/en/latest/zmq_connect.html).

### Syntax
```js
connect(endpoint)
```

### Parameters
The `endpoint` is a string consisting of a `transport://` followed by an `address`.
The `transport` specifies the underlying protocol to use.
The `address` specifies the transport-specific address to connect to.

### Return value
`0` on success, ortherwise an exception.

### Examples
```js
const zmq = new ZMQ();
const zreq = zmq.socket(ZMQ.ZMQ_REQ);
zreq.connect("tcp://localhost:5556");
```

<hr />
## ZMQSocket.prototype.disconnect()
This is a wrapper around [zmq_disconnect()](https://libzmq.readthedocs.io/en/latest/zmq_disconnect.html).

### Syntax
```js
disconnect(endpoint)
```

### Parameters
The `endpoint` is a string consisting of a `transport://` followed by an `address`.
The `transport` specifies the underlying protocol to use.
The `address` specifies the transport-specific address to disconnect from.

### Return value
`0` on success, ortherwise an exception.

### Examples
```js
const zmq = new ZMQ();
const zreq = zmq.socket(ZMQ.ZMQ_REQ);
zreq.connect("tcp://localhost:5556");
zreq.disconnect("tcp://localhost:5556");
```

<hr />
## ZMQSocket.prototype.send()
This is a wrapper around [zmq_send()](https://libzmq.readthedocs.io/en/latest/zmq_send.html).

### Syntax
```js
send(buffer, flags)
```

### Parameters
The `buffer` parameter is an `Uint8FFArray`.

The `flags` parameter is optional. It is `ZMQ.ZMQ_DONTWAIT` by default if not specified.

**NOTE**: I still didn't implement helpers to convert between `string` to `Uint8FFArray`, but it's on my **TODO** list.

### Return value
`0` on success, ortherwise an exception.

### Examples
```js
const zmq = new ZMQ();
const zreq = zmq.socket(ZMQ.ZMQ_REQ);
zreq.connect("tcp://localhost:5556");
const buf = new Uint8FFArray(16);
zreq.send(buf, 0); // flags=0 is blocking
zreq.disconnect("tcp://localhost:5556");
```

<hr />
## ZMQSocket.prototype.recv()
This is a wrapper around [zmq_recv()](https://libzmq.readthedocs.io/en/latest/zmq_recv.html).

### Syntax
```js
send(buffer, flags)
```

### Parameters
The `buffer` parameter is an `Uint8FFArray`.

The `flags` parameter is optional. It is `ZMQ.ZMQ_DONTWAIT` by default if not specified.

**NOTE**: I still didn't implement helpers to convert between `string` to `Uint8FFArray`, but it's on my **TODO** list.

### Return value
`0` on success, ortherwise an exception.

### Examples
```js
const zmq = new ZMQ();
const zreq = zmq.socket(ZMQ.ZMQ_REQ);
zreq.connect("tcp://localhost:5556");
zreq.send(new Uint8FFArray(0)); // empty message
const data = zreq.recv();
if ( data )
{
  console.log(`received ${data.length} bytes`);
  if ( data.length != 0 )
    console.log(JSON.stringify(data));
  zreq.send(new Uint8FFArray(0)); // ack
}
zreq.disconnect("tcp://localhost:5556");
```
