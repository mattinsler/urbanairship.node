(function() {
  var Api, DeviceApi, Rest, UrbanAirship,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Rest = require('rest.node');

  Api = {
    Device: DeviceApi = (function() {
      function DeviceApi(client, id) {
        this.client = client;
        this.id = id;
      }

      DeviceApi.prototype.push = function(opts, cb) {
        return this.client.post('/api/push', {
          audience: {
            device_token: this.id
          },
          device_types: 'all',
          notification: opts
        }, cb);
      };

      DeviceApi.prototype.info = function(cb) {
        return this.client.get("/api/device_tokens/" + this.id, cb);
      };

      return DeviceApi;

    })()
  };

  UrbanAirship = (function(_super) {
    __extends(UrbanAirship, _super);

    UrbanAirship.hooks = {
      json: function(request_opts, opts) {
        if (request_opts.headers == null) {
          request_opts.headers = {};
        }
        return request_opts.headers.Accept = 'application/vnd.urbanairship+json; version=3';
      },
      auth: function(key, secret) {
        return function(request_opts, opts) {
          return request_opts.auth = {
            username: key,
            password: secret
          };
        };
      },
      json_body: function(request_opts, opts) {
        return request_opts.json = opts;
      }
    };

    UrbanAirship.prototype.parse_response_body = function(headers, body) {
      if (typeof body !== 'string') {
        return body;
      }
      if (!(body[0] === '{' && body[body.length - 1] === '}')) {
        return body;
      }
      return JSON.parse(body);
    };

    function UrbanAirship(options) {
      this.options = options != null ? options : {};
      UrbanAirship.__super__.constructor.call(this, {
        base_url: this.options.base_url || 'https://go.urbanairship.com'
      });
      this.hook('pre:request', UrbanAirship.hooks.json);
      if ((this.options.key != null) && (this.options.secret != null)) {
        this.hook('pre:request', UrbanAirship.hooks.auth(this.options.key, this.options.secret));
      }
      this.hook('pre:post', UrbanAirship.hooks.json_body);
    }

    UrbanAirship.prototype.device = function(id) {
      return new Api.Device(this, id);
    };

    return UrbanAirship;

  })(Rest);

  module.exports = UrbanAirship;

}).call(this);
