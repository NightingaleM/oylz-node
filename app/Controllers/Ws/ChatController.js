'use strict'

class ChatController {
  constructor({ socket, request, worker }) {
    this.socket = socket
    this.request = request
    console.log('user joined with %s socket id', socket.id)

  }
  onMessage(message) {
    // same as: socket.on('message')
    console.log(
      Object.keys(this.socket)
    )
    this.socket.broadcastToAll('message', message)
  }

  onClose(a, b, c) {
    // same as: socket.on('close')
  }

  onError() {
    // same as: socket.on('error')
  }
}

module.exports = ChatController
