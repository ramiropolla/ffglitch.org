---
layout: page
title: ZeroMQ
permalink: /docs/0.10.2/quickjs/zeromq/
---

# ZeroMQ

[`ZeroMQ`](https://zeromq.org/) enables
[`ffgac`](../ffgac),
[`ffedit`](../ffedit), and
[`fflive`](../fflive)
to do many kinds of network communication and messaging.
It's possible to use `tcp` connections to communicate across the network,
and it's also possible to use
[`inter-process communication`](https://en.wikipedia.org/wiki/Inter-process_communication)
to allow separate scripts to communicate with each other easily and quickly.

The `"zmq"` module is built-in to the `quickjs` engine.
It is a simple wrapper around `ZeroMQ` functionality.
It can be imported with:
```js
import * as zmq from "zmq";
```

The `"zmq"` module provides the
`Context()` constructor to create `Context` objects, and the
`Poller()` constructor to create `Poller` objects.
The `Context` object provides the `socket()` method to create
`Socket` objects.

This page is mostly based on the [`ZMQ` API reference](https://libzmq.readthedocs.io/en/latest/) itself.

<hr />
## zmq.version()
This function is used to obtain the version of the underlying `ZeroMQ` library.

### Syntax
```js
zmq.version()
```

### Return value
An `Array` with the `[ major, minor, patch ]` version of `ZeroMQ`.

### Examples
```js
import * as zmq from "zmq";
const version = zmq.version();
console.log(version);
// 4,3,6
```

<hr />
## zmq.has()
This function is used to detect whether a certain capability
(transport or security option)
is available in the underlying `ZeroMQ` library.
The following capabilities are defined:

- `"ipc"` - the library supports the ipc:// protocol
- `"pgm"` - the library supports the pgm:// protocol
- `"tipc"` - the library supports the tipc:// protocol
- `"norm"` - the library supports the norm:// protocol
- `"vmci"` - the library supports the vmci:// protocol
- `"curve"` - the library supports the CURVE security mechanism
- `"gssapi"` - the library supports the GSSAPI security mechanism
- `"draft"` - the library is built with the draft api

### Syntax
```js
zmq.has(capability)
```

### Parameters
`capability` is the capability to be probed.

### Return value
`1` if the capability is provided, `0` otherwise.

### Examples
```js
import * as zmq from "zmq";
const has_ipc  = zmq.has("ipc");
const has_vmci = zmq.has("vmci");
console.log(`has_ipc:  ${has_ipc}`);
// has_ipc:  1
console.log(`has_vmci: ${has_vmci}`);
// has_vmci: 0
```

<hr />
## Context Constructor
The `new zmq.Context()` constructor is used to create a new `Context` object.

The `Context` is the main object for using `ZeroMQ`.

This is a wrapper around [`zmq_ctx_new()`](https://libzmq.readthedocs.io/en/latest/zmq_ctx_new.html).

### Syntax
```js
new zmq.Context()
```

### Return value
The new `Context` object.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
```

<hr />
## zmq.Context.prototype.socket()
The `socket()` function is used to create a new `Socket` object
within the given `Context` object.

This is a wrapper around [zmq_socket()](https://libzmq.readthedocs.io/en/latest/zmq_socket.html).

### Syntax
```js
socket(type)
```

### Parameters
The `type` argument specifies the socket type, which determines the semantics of communication over the socket.

The available socket types are:
- `zmq.PAIR`
- `zmq.PUB`
- `zmq.SUB`
- `zmq.REQ`
- `zmq.REP`
- `zmq.DEALER`
- `zmq.ROUTER`
- `zmq.PULL`
- `zmq.PUSH`
- `zmq.XPUB`
- `zmq.XSUB`
- `zmq.STREAM`

### Return value
The new `Socket` object.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
const socket = ctx.socket(zmq.PUSH);
```

<hr />
## zmq.Context.prototype.set()
The `set()` function shall set the option specified by the
`option_name` argument to the value of the `option_value` argument.

This is a wrapper around [zmq_ctx_set()](https://libzmq.readthedocs.io/en/latest/zmq_ctx_set.html).

### Syntax
```js
set(option_name, option_value)
```

### Parameters
Please refer to the
[zmq_ctx_set()](https://libzmq.readthedocs.io/en/latest/zmq_ctx_set.html)
documentation for the available values for `option_name` and `option_value`.

The option names are defined in the `zmq` module, without the `ZMQ_` prefix
as in the documentation above. e.g.: `ZMQ_BLOCKY` becomes `zmq.BLOCKY`.

### Return value
`0` on success.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
ctx.set(zmq.BLOCKY, 0);
```

<hr />
## zmq.Context.prototype.get()
The `get()` function shall return the option specified by the
`option_name` argument.

This is a wrapper around [zmq_ctx_get()](https://libzmq.readthedocs.io/en/latest/zmq_ctx_get.html).

### Syntax
```js
get(option_name)
```

### Parameters
Please refer to the
[zmq_ctx_get()](https://libzmq.readthedocs.io/en/latest/zmq_ctx_get.html)
documentation for the available values for `option_name`.

The option names are defined in the `zmq` module, without the `ZMQ_` prefix
as in the documentation above. e.g.: `ZMQ_MAX_MSGSZ` becomes `zmq.MAX_MSGSZ`.

### Return value
A `number` on success.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
const max_msg_size = ctx.get(zmq.MAX_MSGSZ);
```

<hr />
## zmq.Context.prototype.shutdown()
The `shutdown()` function shall shutdown the `Context`.

This is a wrapper around [zmq_ctx_shutdown()](https://libzmq.readthedocs.io/en/latest/zmq_ctx_shutdown.html).

### Syntax
```js
shutdown()
```

### Return value
`0` on success.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
ctx.shutdown();
```

<hr />
## zmq.Context.prototype.term()
The `term()` function shall destroy the `Context`.

This is a wrapper around [zmq_ctx_term()](https://libzmq.readthedocs.io/en/latest/zmq_ctx_term.html).

**Note**: it is not necessary to call this function.
The garbage collection takes care of destroying the `Context`s.
There is no harm in calling it though.

### Syntax
```js
term()
```

### Return value
`0` on success.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
ctx.term();
```

<hr />
## Poller Constructor
The `new zmq.Poller()` constructor is used to create a new `Poller` object.

This is a wrapper around [zmq_poller_new()](https://libzmq.readthedocs.io/en/latest/zmq_poller.html).

### Syntax
```js
new zmq.Poller()
```

### Return value
The new `Poller` object.

### Examples
```js
import * as zmq from "zmq";
const poller = new zmq.Poller();
```

<hr />
## zmq.Poller.prototype.size()
This is a wrapper around [zmq_poller_size()](https://libzmq.readthedocs.io/en/latest/zmq_poller.html).

### Syntax
```js
size()
```

### Return value
A `number` with the amount of sockets or file descriptors registered with a poller.

### Examples
```js
const size = poller.size();
```

<hr />
## zmq.Poller.prototype.add()
This is a wrapper around [zmq_poller_add()](https://libzmq.readthedocs.io/en/latest/zmq_poller.html).

### Syntax
```js
add(socket, events, user_data)
```

### Parameters
`socket` is the `Socket` object (created with `Context.prototype.socket()`) to be polled.

`events` is a combination of the following values:
- `zmq.POLLIN`
- `zmq.POLLOUT`
- `zmq.POLLERR`
- `zmq.POLLPRI`

`user_data` is an optional parameter that will be passed back for all events that are processed.

### Return value
`0` on success.
Throws an exception on error.

### Examples
```js
poller.add(socket, zmq.POLLIN);
```

<hr />
## zmq.Poller.prototype.modify()
This is a wrapper around [zmq_poller_modify()](https://libzmq.readthedocs.io/en/latest/zmq_poller.html).

### Syntax
```js
modify(socket, events)
```

### Parameters
`socket` is the `Socket` object (which must have already been `add()`ed to the poller).

`events` is a combination of the following values:
- `zmq.POLLIN`
- `zmq.POLLOUT`
- `zmq.POLLERR`
- `zmq.POLLPRI`

### Return value
`0` on success.
Throws an exception on error.

### Examples
```js
poller.modify(socket, zmq.POLLOUT);
```

<hr />
## zmq.Poller.prototype.remove()
This is a wrapper around [zmq_poller_remove()](https://libzmq.readthedocs.io/en/latest/zmq_poller.html).

### Syntax
```js
remove(socket)
```

### Parameters
`socket` is the `Socket` object (which must have already been `add()`ed to the poller).

### Return value
`0` on success.
Throws an exception on error.

### Examples
```js
poller.remove(socket);
```

<hr />
## zmq.PollerEvent

A `PollerEvent` object is returned for every event that is polled.

The object contains 3 key-value pairs:
- `"socket"`: the `Socket` object that originated the event;
- `"user_data"`: the `user_data` parameter passed to the `zmq.Poller.prototype.add()` function;
- `"events"`: a combination of the following values:
  - `zmq.POLLIN`
  - `zmq.POLLOUT`
  - `zmq.POLLERR`
  - `zmq.POLLPRI`

<hr />
## zmq.Poller.prototype.wait()
This is a wrapper around [zmq_poller_wait()](https://libzmq.readthedocs.io/en/latest/zmq_poller.html).

### Syntax
```js
wait(timeout)
```

### Parameters
`timeout` is the maximum time (in milliseconds) the function shall wait.

### Return value
A `PollerEvent` object if any event hapenned within the specified `timeout`, `null` otherwise.
Throws an exception on error.

### Examples
```js
// wait up to 1000 milliseconds
const event = poller.wait(1000);
```

<hr />
## zmq.Poller.prototype.poll()
This is a wrapper around [zmq_poller_wait()](https://libzmq.readthedocs.io/en/latest/zmq_poller.html)
with the `timeout` parameter set to `0`.

### Syntax
```js
poll()
```

### Return value
A `PollerEvent` object if any event is immediately available, `null` otherwise.
Throws an exception on error.

### Examples
```js
// immediate return
const event = poller.poll();
```

<hr />
## zmq.Poller.prototype.wait_all()
This is a wrapper around [zmq_poller_wait_all()](https://libzmq.readthedocs.io/en/latest/zmq_poller.html).

### Syntax
```js
wait_all(n_events, timeout)
```

### Parameters
`n_events` is the maximum number of events the function shall return.

`timeout` is the maximum time (in milliseconds) the function shall wait.

### Return value
An `Array` of `PollerEvent` objects with all events that hapenned within the specified `timeout`, `null` otherwise.
Throws an exception on error.

### Examples
```js
// wait up to 1000 milliseconds for up to 4 events
const events = poller.wait_all(4, 1000);
```

<hr />
## zmq.Poller.prototype.poll_all()
This is a wrapper around [zmq_poller_wait_all()](https://libzmq.readthedocs.io/en/latest/zmq_poller.html)
with the `timeout` parameter set to `0`.

### Syntax
```js
poll_all(n_events)
```

### Parameters
`n_events` is the maximum number of events the function shall return.

### Return value
An `Array` of `PollerEvent` objects with all events that are immediately available, `null` otherwise.
Throws an exception on error.

### Examples
```js
// immediate return, up to 4 events
const events = poller.poll_all(4);
```

<hr />
## zmq.Socket.prototype.bind()
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
`0` on success.
Throws an exception on error.

### Examples
TODO

<hr />
## zmq.Socket.prototype.unbind()
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
`0` on success.
Throws an exception on error.

### Examples
TODO

<hr />
## zmq.Socket.prototype.connect()
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
`0` on success.
Throws an exception on error.

### Examples
TODO

<hr />
## zmq.Socket.prototype.disconnect()
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
`0` on success.
Throws an exception on error.

### Examples
TODO

<hr />
## zmq.Socket.prototype.send()
This is a wrapper around [zmq_send()](https://libzmq.readthedocs.io/en/latest/zmq_send.html).

### Syntax
```js
send(buffer, flags)
```

### Parameters
The `buffer` parameter is an `Uint8FFArray`.

The `flags` parameter is optional. It is `ZMQ.ZMQ_DONTWAIT` by default if not specified.

### Return value
A `number` with the amount of bytes in the message if successful,
`undefined` if non-blocking mode was requested and the message could not be sent at the moment.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
const zreq = zmq.socket(ZMQ.ZMQ_REQ);
zreq.connect("tcp://localhost:5556");
const buf = new Uint8FFArray(16);
zreq.send(buf, 0); // flags=0 is blocking
zreq.disconnect("tcp://localhost:5556");
```

<hr />
## zmq.Socket.prototype.recv()
This is a wrapper around [zmq_recv()](https://libzmq.readthedocs.io/en/latest/zmq_recv.html).

### Syntax
```js
send(buffer, flags)
```

### Parameters
The `buffer` parameter is an `Uint8FFArray`.

The `flags` parameter is optional. It is `ZMQ.ZMQ_DONTWAIT` by default if not specified.

### Return value
An `Uint8FFArray` with the message if successful,
`undefined` if non-blocking mode was requested and the message could not be received at the moment.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
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

<hr />
## zmq.Socket.prototype.recv_int()

### Return value
A 32-bit `number` with the message if successful,
`undefined` if non-blocking mode was requested and the message could not be received at the moment.
Throws an exception on error or if the received message was not a 32-bit integer.

<hr />
## zmq.Socket.prototype.recv_bigint()

### Return value
A 64-bit `BigInt` number with the message if successful,
`undefined` if non-blocking mode was requested and the message could not be received at the moment.
Throws an exception on error or if the received message was not a 64-bit integer.

<hr />
## zmq.Socket.prototype.recv_str()

### Return value
A `String` with the message if successful,
`undefined` if non-blocking mode was requested and the message could not be received at the moment.
Throws an exception on error.

<hr />
## zmq.Socket.prototype.recv_uint8ffarray()

TODO same as `zmq.Socket.prototype.recv`

<hr />
## zmq.Socket.prototype.close()

### Return value
`0` on success.
Throws an exception on error.

<hr />
## zmq.Socket.prototype.getsockopt()

// if no specific type requested, try int and bigint first, and then string

<hr />
## zmq.Socket.prototype.getsockopt_int()

// FFglitch extra

<hr />
## zmq.Socket.prototype.getsockopt_bigint()

// FFglitch extra

<hr />
## zmq.Socket.prototype.getsockopt_str()

// FFglitch extra

<hr />
## zmq.Socket.prototype.getsockopt_uint8ffarray()

// FFglitch extra

<hr />
## zmq.Socket.prototype.setsockopt()
