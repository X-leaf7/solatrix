const crypto = require('crypto');
const { getMessages, putMessage } = require('./dynamo');
const Event = {};
const Team = {};
const User = {};
const Message = {};
const Notification = {};
//const moment = require('moment');

module.exports = {

  async checkEvent(socket, data) {
    let eventId = data.eventId;
    return Event.findOne({
      where: {
        id: eventId,
      },
    })
      .then(async (eventdata) => {
        let eventStatus = await dateConvert(eventdata);
        return {
          msg: "Join the chat room",
          data: eventdata,
          statusCode: 200,
        }
      })
      .catch((error) => {
        return {
          msg: "No running event(s) found",
          data: {},
          statusCode: 201,
        };
      });
  },

  async eventDetail(socket, data) {

    let id = data.eventId;
    await Event.findOne({
      where: {
        id: id,
      },
    })
      .then(async (eventdata) => {
        let findHomeTeam = await Team.findOne({
          where: {
            id: eventdata.hometeam,
          },
        });
        let findAwayTeam = await Team.findOne({
          where: {
            id: eventdata.awayteam,
          },
        });
        return {
          msg: "chat room detail",
          data: {
            event: eventdata,
            homeTeam: findHomeTeam,
            awayTeam: findAwayTeam,
          },
          statusCode: 200,
        }
      })
      .catch((error) => {
        return {
          msg: "No running event(s) found",
          data: {},
          statusCode: 201,
        };
        //res.status(400).send(error);
      });
  },

  async sendMessage(socket, data) {
    const messageId = crypto.randomUUID();
    data.messageId = messageId;
    io.to(data.eventId).emit('newMessage', data);
    putMessage(data);
    return {
      success: true
    };
  },

  async deleteMessage(socket, data) {
    try {
      io.to(data.eventId).emit('removeMessage', data);
      data.redacted = true
      putMessage(data)
    } catch (error) {
      return {
        success: false,
        msg: error,
        data: data,
      };
    }

    return {
      success: true,
      message: data
    }
  },

  async joinRoom(socket, data) {
    // TODO check user token and id by calling /users/me endpoint on django app
    socket.join(data.eventId)

    const messages = await getMessages(data.eventId)

    return {
      success: true,
      messages: messages
    }
  },

  async leaveRoom(socket, data) {
    try {
      let id = data.eventId;
      let eventdata = await Event.findOne({
        where: {
          id: id,
        },
      });
      if (eventdata) {
        console.log("eventdata.roomId", eventdata.roomId);
        socket.leave(eventdata.roomId);

        return {
          msg: "leave room",
          data: {},
          statusCode: 200,
        }
      } else {
        return {
          msg: "No event(s) found",
          data: {},
          statusCode: 201,
        };
      }
    } catch (error) {
      return {
        msg: "something went wrong please try again",
        data: {},
        statusCode: 400,
      };
    }
  },

  async getnotification(socket) {
    try {
      let eventdata = await Notification.findAll({
        where: {
          is_deleted: false,
          status: 'unread'
        },
        include: [
          {
            model: Event,
            as: "event",
            attributes: ['name'],
          },
          {
            model: User,
            as: "user",
            attributes: ['username'],
          },
          { model: Team, as: "teamRef", attributes: ['name'], },
        ],
        order: [["id", "DESC"]],
        raw: true,
      })
      return {
        msg: "get notification successfully",
        data: eventdata,
        statusCode: 200,
      };

    } catch (error) {
      return {
        msg: "something went wrong please try again",
        data: {},
        statusCode: 400,
      };
    }
  },

  async updateNotificationStatus(socket, data) {
    try {
      let eventdata = await Notification.findOne({
        where: {
          id: data,
          is_deleted: false,
        }
      })

      if (eventdata) {
        var updateREcordGet = await Notification.update({ status: 'read' }, { where: { id: data }, returning: true })

        console.log(updateREcordGet)

        return {
          msg: "Notification status update successfully",
          statusCode: 200,
        }
      } else {
        return {
          msg: "Notification status not update",
          statusCode: 400,
        }
      }
    } catch (error) {
      return {
        msg: "something went wrong please try again",
        statusCode: 400,
      };
    }
  },

  async readableNotification(socket, data) {
    try {
      var updateREcordGet = await Notification.update({ status: 'read' }, { where: { status: 'unread' }, returning: true })

      console.log(updateREcordGet)

      return {
        msg: "Notification status update successfully",
        statusCode: 200,
      }
    } catch (error) {
      return {
        msg: "something went wrong please try again",
        statusCode: 400,
      };
    }
  },

  async getAllEvents(req, res) {
    let AllEvents = await Event.findAll({
      where: { is_active: true, is_deleted: false },
      order: [["createdat", "DESC"]],
    });
    if (AllEvents.length > 0) {
      AllEvents.forEach(async function (event) {
        await eventTimer(event.id);
      });
    }
  },
};
