# gpgsync

* The Go Playground with coedit mode.

## Demo

https://gpgsync.herokuapp.com

### Features

```console
# Open room
https://gpgsync.herokuapp.com/rooms/someRoomID

# Use shared content to create room (exampleID: xXqRTAb2hu7)
https://gpgsync.herokuapp.com/p/xXqRTAb2hu7

# Open room with shared content (exampleID: xXqRTAb2hu7)
https://gpgsync.herokuapp.com/rooms/someRoomID/p/xXqRTAb2hu7
```

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
