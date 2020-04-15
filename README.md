# TokamakJS

An opinionated modern framework to build React applications using the latest tools in the React ecosystem.

## Installation

TODO

## Getting Started

TODO

## Concepts

TODO

## Simple Example

```ts
import React from 'react';
import { route, module, createRoute, renderModule } from 'tokamak';

const HelloView = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <h2>Welcome to Tokamak</h2>
    </div>
  );
};

@route({ view: HelloView })
class HelloRoute {}

@module({ 
  routing: [createRoute('/', HelloRoute)],
})
class AppModule {}

renderModule(AppModule, '#root');
```
