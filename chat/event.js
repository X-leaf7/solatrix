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
    try {
      let id = data.eventId;
      let eventdata = await Event.findOne({
        where: {
          id: id,
          is_active: true,
          is_deleted: false
        },
      });
      if (eventdata) {
        let type = '';
        if (data.type) {
          type = data.type
        } else {
          let homeuser = eventdata.homeuser;
          type = 'away';
          if (homeuser.includes(data.userid)) {
            type = 'home';
          }
        }

        if (eventdata.host == data.userid) {
          data.sendertype = 'host';
        }
        // if (type == '') {
        //   let homeuser = eventdata.homeuser;
        //   type = 'away';
        //   if (homeuser.includes(data.userid)) {
        //     type = 'home';
        //   }
        // }

        let message = await Message.create({
          eventid: eventdata.id,
          userid: data.userid,
          type: type,
          sendertype: data.sendertype,
          message: data.message,
          is_deleted: false,
        });
        let messagesData = await Message.findOne({
          // raw: true,
          where: { id: message.id },
          order: [["id", "DESC"]],
          include: [
            {
              model: User,
              as: "user",
            },
            {
              model: Event,
              as: "event",
              attributes: ['host']
            },
            // { model: Team, as: "awayTeamRef" },
          ],
        });
        //socket.emit("thread", messagesData);
        let objData = {
          msg: "chat room detail",
          data: messagesData,
          statusCode: 200,
        };
        io.to(eventdata.roomId).emit("thread", objData);
        //socket.broadcast.emit("thread", messagesData);
        return {
          msg: "chat room detail",
          data: messagesData,
          statusCode: 200,
        }
      } else {
        let deActiveEvent = await Event.findOne({
          where: {
            id: id
          },
        });
        let objData = {
          msg: "Event Deactivated",
          data: {},
          statusCode: 201,
        };
        io.to(deActiveEvent.roomId).emit("thread", objData);
        return {
          msg: "Event Deactivated",
          data: {},
          statusCode: 201,
        };
      }
    } catch (error) {

      console.log(error)

      return {
        msg: "something went wrong please try again",
        data: {},
        statusCode: 400,
      };
    }
  },

  async joinRoom(socket, data) {
    try {
      let id = data.eventId;
      let eventdata = await Event.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: User,
            as: "hostuser",
          },
          // { model: Team, as: "awayTeamRef" },
        ],
      });
      if (eventdata) {
        console.log("eventdata.roomId", eventdata.roomId);
        socket.join(eventdata.roomId);

        let eventTime = await dateConvert(eventdata);

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
        //socket.emit("join", data);
        // socket.broadcast.to(eventdata.id).emit("join", data);
        // io.to(eventdata.id).emit("join", data);
        let messagesData = await Message.findAll({
          // raw: true,
          where: { is_deleted: false, eventid: id },
          order: [["id", "ASC"]],
          include: [
            {
              model: User,
              as: "user",
            },
            // { model: Team, as: "awayTeamRef" },
          ],
        })
        return {
          msg: "chat room detail",
          data: {
            event: eventdata,
            homeTeam: findHomeTeam,
            awayTeam: findAwayTeam,
            messages: messagesData,
            eventTime: eventTime,
          },
          statusCode: 200,
        }
      } else {
        return {
          msg: "No running event(s) found",
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

  async deleteMessage(socket, data) {
    try {
      let eventId = data.eventId;
      let id = data.id;

      console.log("data",data)

      let messageData = await Message.findOne({
        where: {
          id: id,
          eventid: eventId
        },
      });

      console.log("messageData",messageData)

      if (messageData) {
        await Message.update(
          {
            is_deleted: true,
          },
          {
            where: { id: id },
            returning: true,
          }
        )
        let result = {
          msg: "Message deleted successfully",
          data: { id: messageData.id },
          statusCode: 200,
        };

        console.log(result)

        //socket.emit("thread", messagesData);
        io.emit("removeMessage", result);
        //socket.broadcast.emit("thread", messagesData);
      } else {
        return {
          msg: "No running event(s) found",
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
var b = [];
async function eventTimer(eventid) {
  //console.log('eventdata:', eventdata);
  let eventdata = await Event.findOne({
    where: {
      id: eventid,
    },
  })

  // var endTime = eventdata.joinTime + ':01';
  // var startTime = moment(new Date(), 'DD-MM-YYYY hh:mm:ss');
  // var endDate = moment(`${eventdata.joinDate} ${endTime}`, 'DD-MM-YYYY hh:mm:ss');
  // //if (endDate >= startTime) {
  //   console.log('startTime:' + startTime);
  //   console.log('endDate:' + endDate);

  //   var secondsDiff = endDate.diff(startTime, 'seconds');
  //   console.log('Seconds:' + secondsDiff);
  if (b["var" + eventdata.roomId]) {
    clearInterval(b["var" + eventdata.roomId]);
  }
  b["var" + eventdata.roomId] = setInterval(async function () {
    let eventTime = await dateConvert(eventdata);
    io.to(eventdata.roomId).emit('counter', eventTime);
    //secondsDiff--

    if (eventTime.watingTime == 0) {
      io.to(eventdata.roomId).emit('counter', eventTime);
      //clearInterval(WinnerCountdown);
      clearInterval(b["var" + eventdata.roomId]);
    }
  }, 1000);
  // } else {

  // }

}
async function dateConvert(eventdata) {
  var startTime = "09:00:00";
  var endTime = eventdata.createTime + ':00';
  //var todayDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); //Instead of today date, We can pass whatever date        

  var startDate = new Date(`${todayDate}`);
  var endDate = new Date(`${eventdata.createDate} ${endTime}`);
  if (endDate >= startDate) {
    var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());

    var hh = Math.floor(timeDiff / 1000 / 60 / 60);
    //console.log('AAAAAAAAAAA', hh);
    //hh = ('0' + hh).slice(-2)
    hh = (hh < 10) ? ('0' + hh) : hh;

    timeDiff -= hh * 1000 * 60 * 60;
    var mm = Math.floor(timeDiff / 1000 / 60);
    mm = ('0' + mm).slice(-2)

    timeDiff -= mm * 1000 * 60;
    var ss = Math.floor(timeDiff / 1000);
    ss = ('0' + ss).slice(-2)

    var watingTime = hh + ":" + mm + ":" + ss;
    return {
      roomId: eventdata.roomId,
      eventId: eventdata.id,
      eventStart: false,
      watingTime: watingTime,
    }
  } else {
    return {
      roomId: eventdata.roomId,
      eventId: eventdata.id,
      eventStart: true,
      watingTime: 0,
    }
  }
}
