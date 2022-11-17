const eventController = require("./event");

module.exports = function (socket) {
    try {
      socket.on("checkEvent",async function(data, response) {
        response(await eventController.checkEvent(socket,data));
      });

      socket.on("eventDetail",async function(data, response) {
        response(await eventController.eventDetail(socket,data));
      });

      socket.on("sendMessage",async function(data, response) {
        response(await eventController.sendMessage(socket,data));
      });

      socket.on("join",async function(data, response) {
        response(await eventController.joinRoom(socket,data));
      });

      socket.on("leaveRoom",async function(data, response) {
        response(await eventController.leaveRoom(socket,data));
      });

      socket.on("messagesDelete",async function(data, response) {
        response(await eventController.deleteMessage(socket,data));
      });

      socket.on("getAllNotification",async function(response) {
        response(await eventController.getnotification(socket));
      });

      socket.on("updateNotificationStatus",async function(data, response) {
        response(await eventController.updateNotificationStatus(socket, data));
      });

      socket.on("clearNotificationStatus",async function(response) {
        response(await eventController.readableNotification(socket));
      });

      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });

    }
    catch (error) {
      console.log("Error In Common socket Handler : ", error);
    }
  }