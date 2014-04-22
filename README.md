# urbanairship.node

[UrbanAirship](http://www.urbanairship.com) API client for node.js

## Installation
```
npm install urbanairship.node
```

## Usage

```javascript
var UrbanAirship = require('urbanairship.node');

var client = new UrbanAirship({key: '...', secret: '...'});

// Send push notification to a device
client.device('....').push({
  alert: 'Hello!'
});
```

## License
Copyright (c) 2014 Matt Insler  
Licensed under the MIT license.
