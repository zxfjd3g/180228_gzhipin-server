const {ChatModel} = require('../db/models')
module.exports = function (server) {
  // 产生socketio的管理对象
  const io = require('socket.io')(server)
  // 监视与浏览器连接, 接收到一个连接对象(socket)
  io.on('connection', function (socket) {// 与某个浏览器的连接

    // 监视当前socket对应浏览器向服务器发送消息
    socket.on('sendMsg', function ({from, to, content}) { // 浏览器发送的消息数据(data)

      // 1. 保存chat到chats集合中
      const chat = {
        from,
        to,
        content,
        chat_id: from + '_' + to,
        create_time: Date.now()
      }
      new ChatModel(chat).save(function (error, chatMsg) {
        // 2. 向浏览器发送消息(chat对象)
        io.emit('receiveMsg', chatMsg)
      })
    })
  })
}