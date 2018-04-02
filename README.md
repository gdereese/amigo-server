# amigo-server

[![Build Status](https://travis-ci.org/gdereese/amigo-server.svg?branch=master)](https://travis-ci.org/gdereese/amigo-server)
[![npm version](https://badge.fury.io/js/amigo-server.svg)](https://badge.fury.io/js/amigo-server)

Server that allows you to create and manage a graph of users linked to others users as friends.

## Summary

amigo is useful for providing a basic social network to users of an existing or in-development application by running this server in your application environment.

It is implemented as a [Node](https://nodejs.org) [Restify](http://restify.com) server and is intended to either be hosted as a stand-alone process or included as a dependency of an existing Node server and hosted in that process alongside whatever listeners it has configured.

amigo is not designed to serve as a method for authenticating users or storing user details. Rather, it merely serves as system for referencing existing users in your primary system and maintaining friend relationships between that set of users.

## Features

* HTTP/JSON API that supports the following overall use cases:
  * User (sender) submits a friend request to another user (recipient)
  * Recipient can accept or reject the request
  * Sender can cancel/rescind the request before it is accepted
  * Delete a user's link to a friend
  * Query pending friend requests by sender/recipient/both
  * Query a user's friends

## Compatibility

This package has been tested on the following versions of Node.js:

* 6.x
* 8.x
* 9.x

## Installation

### Install locally:

```
npm install amigo-server
```

### Install globally:

```
npm install amigo-server -g
```

## Usage

### Stand-alone Server

To use amigo as a stand-alone server process, simply invoke it from the command-line.

```
Usage: amigo-server [options]

  Options:

    -a, --address <a>  Address to listen on (default: 127.0.0.1)
    -p, --port <n>     Port to listen on
    -h, --help         output usage information
```

Like this:

```
$ amigo-server --port 1234
```

If you do not specify the `--port` option, an open port will be selected at random.

### Included in Another Server

To host amigo in your own Restify server process, import this module into your package and invoke the `amigoServer()` function:

```
const amigoServer = require('amigo-server');

const server = restify.createServer();

const settings = {};

// setup existing Restify server instance with amigo endpoints
amigoServer(server, settings);

server.listen(1234, () => {
  console.log('Server started!');
});
```

### Read More

TODO
