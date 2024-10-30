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
A `timeout` of `-1` is an infinite timeout.

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
A `timeout` of `-1` is an infinite timeout.

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
```js
socket.bind("tcp://*:5555");
```

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
```js
socket.unbind("tcp://*:5555");
```

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
```js
socket.connect("tcp://localhost:5555");
```

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
```js
socket.disconnect("tcp://localhost:5555");
```

<hr />
## zmq.Socket.prototype.send()
This is a wrapper around [zmq_send()](https://libzmq.readthedocs.io/en/latest/zmq_send.html).

### Syntax
```js
send(data, flags)
```

### Parameters
The `data` parameter can be either of the following:
- `null`: an empty message is sent
- `number` or `boolean`: a 32-bit integer is sent
- `BigInt`: a 64-bit integer is sent
- `string`: a string is sent (it may contain `\0` characters)
- `Uint8FFArray`: a `uint8_t` buffer is sent

The `flags` parameter is optional. It is `0` by default if not specified.
The option names are defined in the `zmq` module, without the `ZMQ_` prefix
as in the documentation above. e.g.: `ZMQ_DONTWAIT` becomes `zmq.DONTWAIT`.

### Return value
A `number` with the amount of bytes in the message if successful,
`undefined` if non-blocking mode was requested and the message could not be sent at the moment.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
const socket = ctx.socket(zmq.REQ);
socket.connect("tcp://localhost:5555");
socket.send(null);
socket.send(10);
socket.send(true);
socket.send("apfelstrudel");
const data = new Uint8FFArray(10);
data.forEach((_, i) => { data[i] = i; });
socket.send(data, zmq.DONTWAIT);
```

<hr />
## zmq.Socket.prototype.recv()
This is a wrapper around [zmq_recv()](https://libzmq.readthedocs.io/en/latest/zmq_recv.html).

It returns binary data in an `Uint8FFArray`.
**Note**: more specialized functions (for types such as 32-bit and 64-bit integers or strings)
are available and will be described below.

### Syntax
```js
recv(flags)
```

### Parameters
The `flags` parameter is optional. It is `0` by default if not specified.
The option names are defined in the `zmq` module, without the `ZMQ_` prefix
as in the documentation above. e.g.: `ZMQ_DONTWAIT` becomes `zmq.DONTWAIT`.

### Return value
An `Uint8FFArray` with the message if successful,
`undefined` if non-blocking mode was requested and the message could not be received at the moment.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
const socket = ctx.socket(zmq.REP);
socket.bind("tcp://*:5555");
// assuming there is already data received
const data = socket.recv(zmq.DONTWAIT);
// blocking wait for data
data = socket.recv();
socket.send(null);
```

<hr />
## zmq.Socket.prototype.recv_int()
The `recv_int()` function is similar to `recv()` above,
but it only receives 32-bit integers.

### Return value
A 32-bit `number` with the message if successful,
`undefined` if non-blocking mode was requested and the message could not be received at the moment.
Throws an exception on error or if the received message was not a 32-bit integer.

<hr />
## zmq.Socket.prototype.recv_bigint()
The `recv_bigint()` function is similar to `recv()` above,
but it only receives 64-bit integers.

### Return value
A 64-bit `BigInt` number with the message if successful,
`undefined` if non-blocking mode was requested and the message could not be received at the moment.
Throws an exception on error or if the received message was not a 64-bit integer.

<hr />
## zmq.Socket.prototype.recv_str()
The `recv_str()` function is similar to `recv()` above,
but it only receives strings.

### Return value
A `String` with the message if successful,
`undefined` if non-blocking mode was requested and the message could not be received at the moment.
Throws an exception on error.

<hr />
## zmq.Socket.prototype.recv_uint8ffarray()
The `recv_uint8ffarray()` function the same as `recv()` above,
but the name is more explicit.

### Return value
An `Uint8FFArray` with the message if successful,
`undefined` if non-blocking mode was requested and the message could not be received at the moment.
Throws an exception on error.

<hr />
## zmq.Socket.prototype.close()
The `close()` function shall destroy the `Socket`.

This is a wrapper around [zmq_close()](https://libzmq.readthedocs.io/en/latest/zmq_close.html).

**Note**: it is not necessary to call this function.
The garbage collection takes care of destroying the `Socket`s.
There is no harm in calling it though.

### Syntax
```js
close()
```

### Return value
`0` on success.
Throws an exception on error.

### Examples
```js
import * as zmq from "zmq";
const ctx = new zmq.Context();
const socket = ctx.socket(zmq.REP);
socket.close();
```

<hr />
## zmq.Socket.prototype.getsockopt()
The `getsockopt()` function shall retrieve the value for the option specified by the `option_name` argument.

This is a wrapper around [zmq_getsockopt()](https://libzmq.readthedocs.io/en/latest/zmq_getsockopt.html).

**Note**: more specialized functions (for types such as 32-bit and 64-bit integers or strings)
are available and will be described below.

**Note2**: if no specialized function is used, this function will try to
treat the options as these types in the following order:
`string`, `int`, `bigint`.

### Syntax
```js
getsockopt(option_name)
```

### Parameters
Please refer to the
[zmq_getsockopt()](https://libzmq.readthedocs.io/en/latest/zmq_getsockopt.html)
documentation for the available values for `option_name`.

The option names are defined in the `zmq` module, without the `ZMQ_` prefix
as in the documentation above. e.g.: `ZMQ_MAXMSGSIZE` becomes `zmq.MAXMSGSIZE`.

### Return value
Either a `string`, an `int`, a `BigInt`, or `undefined`.
Throws an exception on error.

<hr />
## zmq.Socket.prototype.getsockopt_int()
The `getsockopt_int()` function is similar to `getsockopt()` above,
but it only works if the option is a 32-bit integer.

### Return value
A 32-bit `number` with the option value if successful, `undefined` otherwise.
Throws an exception on error or if the option was not a 32-bit integer.

<hr />
## zmq.Socket.prototype.getsockopt_bigint()
The `getsockopt_bigint()` function is similar to `getsockopt()` above,
but it only works if the option is a 64-bit integer.

### Return value
A 64-bit `BigInt` with the option value if successful, `undefined` otherwise.
Throws an exception on error or if the option was not a 64-bit integer.

<hr />
## zmq.Socket.prototype.getsockopt_str()
The `getsockopt_str()` function is similar to `getsockopt()` above,
but it only works if the option is a string.

### Return value
A `string` with the option value if successful, `undefined` otherwise.
Throws an exception on error or if the option was not a string.

<hr />
## zmq.Socket.prototype.getsockopt_uint8ffarray()
The `getsockopt_uint8ffarray()` function is similar to `getsockopt()` above,
but it only works if the option is an `Uint8FFArray`.

### Return value
An `Uint8FFArray` with the option value if successful, `undefined` otherwise.
Throws an exception on error or if the option was not an `Uint8FFArray`.

<hr />
## zmq.Socket.prototype.setsockopt()
The `setsockopt()` function shall set the option specified by the `option_name` argument to the value pointed to by the `option_value` argument.

This is a wrapper around [zmq_setsockopt()](https://libzmq.readthedocs.io/en/latest/zmq_setsockopt.html).

### Syntax
```js
setsockopt(option_name, option_value)
```

### Parameters
Please refer to the
[zmq_setsockopt()](https://libzmq.readthedocs.io/en/latest/zmq_setsockopt.html)
documentation for the available values for `option_name`.

The option names are defined in the `zmq` module, without the `ZMQ_` prefix
as in the documentation above. e.g.: `ZMQ_SUBSCRIBE` becomes `zmq.SUBSCRIBE`.

### Return value
`0` on success.
Throws an exception on error.


<hr />
## Full Example

This example consists of three scripts:
- `producer.js`, which connects to the server in `zmq.PUSH` mode and sends data from the command line parameters
- `subscriber.js`, which connects to the server in `zmq.SUB` mode and waits for data
- `server.js`, which acts as a server that forwards data sent from producers to subscribers

`server.js`:
```js
import * as zmq from "zmq";
function main()
{
  const ctx = new zmq.Context();
  const producer_socket = ctx.socket(zmq.PULL);
  producer_socket.bind("tcp://*:5555");
  const subscriber_socket = ctx.socket(zmq.PUB);
  subscriber_socket.bind("tcp://*:5556");
  const poller = new zmq.Poller();
  poller.add(producer_socket, zmq.POLLIN);
  while ( 42 )
  {
    const event = poller.wait(-1); // infinite wait
    if ( !event )
      continue;
    const socket = event.socket; // should be producer_socket
    const data = socket.recv_str();
    subscriber_socket.send(data);
    console.log(`Forwarded "${data}"`);
  }
  subscriber_socket.close();
  producer_socket.close();
  ctx.term();
}
try {
  main();
} catch (e) {
  console.log("Uncaught exception!");
  console.log(e);
  if ( e.stack )
    console.log(e.stack);
}
```

`subscriber.js`:
```js
import * as zmq from "zmq";
function main()
{
  const ctx = new zmq.Context();
  const socket = ctx.socket(zmq.SUB);
  socket.connect("tcp://localhost:5556");
  socket.setsockopt(zmq.SUBSCRIBE, "");
  while ( true )
  {
    const data = socket.recv_str();
    console.log(`Received "${data}"`);
  }
  socket.close();
  ctx.term();
}
try {
  main();
} catch (e) {
  console.log("Uncaught exception!");
  console.log(e);
  if ( e.stack )
    console.log(e.stack);
}
```

`producer.js`:
```js
import * as zmq from "zmq";
function main(argv)
{
  const ctx = new zmq.Context();
  const socket = ctx.socket(zmq.PUSH);
  socket.connect("tcp://localhost:5555");
  argv.forEach((data) => {
    socket.send(data);
    console.log(`Sent "${data}"`);
  });
  socket.close();
  ctx.term();
}
try {
  main(scriptArgs.slice(1));
} catch (e) {
  console.log("Uncaught exception!");
  console.log(e);
  if ( e.stack )
    console.log(e.stack);
}
```

In one terminal, leave the server running:
```bash
$ qjs server.js
```

On another terminal, leave the subscriber running:
```bash
$ qjs subscriber.js
```

On yet another terminal, send messages using the producer:
```bash
$ qjs producer.js hello world
Sent "hello"
Sent "world"
```

On the producer terminal, you should now see:
```bash
Sent "hello"
Sent "world"
```

On the subscriber terminal, you should now see:
```bash
Received "hello"
Received "world"
```

On the server terminal, you should now see:
```bash
Forwarded "hello"
Forwarded "world"
```
