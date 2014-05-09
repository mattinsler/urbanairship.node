Rest = require 'rest.node'

Api = {
  Device: class DeviceApi
    constructor: (@client, @id) ->
    push: (opts, cb) -> @client.post('/api/push', {audience: {device_token: @id}, device_types: 'all', notification: opts}, cb)
    info: (cb) -> @client.get("/api/device_tokens/#{@id}", cb)
  
  Devices: class DevicesApi
    constructor: (@client, @ids) ->
    push: (opts, cb) -> @client.post('/api/push', {audience: {'or': @ids.map (id) -> {device_token: id}}, device_types: 'all', notification: opts}, cb)
}

class UrbanAirship extends Rest
  @hooks:
    json: (request_opts, opts) ->
      request_opts.headers ?= {}
      # request_opts.headers.Accept = 'application/json'
      request_opts.headers.Accept = 'application/vnd.urbanairship+json; version=3'
    
    auth: (key, secret) ->
      (request_opts, opts) ->
        request_opts.auth =
          username: key
          password: secret
    
    json_body: (request_opts, opts) ->
      request_opts.json = opts
  
  parse_response_body: (headers, body) ->
    return body unless typeof body is 'string'
    return body unless body[0] is '{' and body[body.length - 1] is '}'
    JSON.parse(body)
  
  constructor: (@options = {}) ->
    super(base_url: @options.base_url or 'https://go.urbanairship.com')
    
    @hook('pre:request', UrbanAirship.hooks.json)
    @hook('pre:request', UrbanAirship.hooks.auth(@options.key, @options.secret)) if @options.key? and @options.secret?
    @hook('pre:post', UrbanAirship.hooks.json_body)
  
  device: (id) -> new Api.Device(@, id)
  devices: (ids) -> new Api.Devices(@, ids)

module.exports = UrbanAirship
