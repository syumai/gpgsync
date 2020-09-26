# gpgsync

* The Go Playground with coedit mode.

## Demo

https://gpgsync.herokuapp.com

### Features

```console
# Open room
https://gpgsync.herokuapp.com/rooms/:roomId

# Use shared content to create room
https://gpgsync.herokuapp.com/p/:sharedContentId

# Open room with shared content
https://gpgsync.herokuapp.com/rooms/:roomId/p/:sharedContentId
```

* shared content ID can be gotten by Go Playground's `share` function.
  - example: https://gpgsync.herokuapp.com/rooms/exampleRoom/p/xXqRTAb2hu7

## Usage

```
npm install
node server.js // Runs on http://localhost:8080
```

## Dependencies

* [socket.io](https://socket.io/)
* [ot.js](https://github.com/Operational-Transformation/ot.js)
* [@syumai/goplayground](https://github.com/syumai/goplayground-js)

## References

* Original `The Go Playground` by Go team
  - https://play.golang.org/
* Base Idea from ttakuru88: https://github.com/ttakuru88/ot_sample
  - Blog: https://kray.jp/blog/algorithm-operational-transformation/

## Author

syumai

## LICENSE

MIT
