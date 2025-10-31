import Analytics_dashboard from "../models/analytics_dashboard.js";
import Rooms from "../models/rooms.js";
import sequelize from "sequelize";
import Users from "../models/users.js";

async function postAnalyticsDashboard(req, res) {
  try {
    const { internalId, dashboardAccessToken, learning_dashboard_data } = req.body;
    const dashboardJson = JSON.parse(learning_dashboard_data)
    if(!(internalId && dashboardAccessToken && dashboardJson.extId && dashboardJson.createdOn && dashboardJson.endedOn)) {
      return res.status(400).json({ message: "Data incorrect" });
    }
    function totalOfActivity(activitiesJson) {
      if(activitiesJson.users) {
        const usersTimes = Object.values(activitiesJson.users || {}).reduce((prev, user) => ([
          ...prev,
          ...Object.values(user.intIds),
        ]), []);
  
        const minTime = Object.values(usersTimes || {}).reduce((prevVal, elem) => {
          if (prevVal === 0 || elem.registeredOn < prevVal) return elem.registeredOn;
          return prevVal;
        }, 0);
  
        const maxTime = Object.values(usersTimes || {}).reduce((prevVal, elem) => {
          if (elem.leftOn === 0) return (new Date()).getTime();
          if (elem.leftOn > prevVal) return elem.leftOn;
          return prevVal;
        }, 0);
  
        return maxTime - minTime;
      } else {
        return 0;
      }
    }
    const meetingDuration = totalOfActivity(dashboardJson);
    const roomsData = await Rooms.findOne({ where: { meeting_id: dashboardJson.extId } });
    const postData = {
      meeting_id: dashboardJson.extId,
      created_on: dashboardJson.createdOn,
      ended_on: dashboardJson.endedOn,
      dashboard_access_token: dashboardAccessToken,
      learning_dashboard_data: dashboardJson,
      internal_id: internalId,
      duration: meetingDuration,
    }
    if(roomsData?.user_id) {
      postData.user_id = roomsData?.user_id;
    }
    const userdata = await Analytics_dashboard.findOne({ where: { internal_id: postData.internal_id } });
    if(userdata) {
      userdata.ended_on = dashboardJson.endedOn,
      userdata.learning_dashboard_data = dashboardJson,
      await userdata.save();
      return res.json({ message: "sucess", message: "Updated", data: userdata }); 
    }
    const updatedData = await Analytics_dashboard.create(postData);
    console.log('updatedData', req.body);
    return res.json({ message: "sucess", message: "Created", data: updatedData });
  } catch(err) {
    console.log('Error - update recording', err)
    return res.status(400).json({ message: err.message });
  }
}

const getAllByMeetingIdAnalyticsDashboard = async (req, res) => {
  try {
    const id = req?.params?.id;
    const page = parseInt(req.query.page) || 1; // Current page
    const perPage = parseInt(req.query.perPage) || 10; // Records per page
    const offset = (page - 1) * perPage;
    const { count, rows } = await Analytics_dashboard.findAndCountAll({
      where: { meeting_id: id },
      limit: perPage,
      offset,
    });
    const totalPages = Math.ceil(count / perPage);
    res.status(200).send({
      data: rows,
      pagination: {
        currentPage: page,
        lastPage: totalPages,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

  const getAllAnalyticsDashboard = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Current page
      const perPage = parseInt(req.query.perPage) || 10; // Records per page
      const offset = (page - 1) * perPage;
      const { count, rows } = await Analytics_dashboard.findAndCountAll({
        limit: perPage,
        offset,
      });
      const totalPages = Math.ceil(count / perPage);
      res.status(200).send({
        data: rows,
        pagination: {
          currentPage: page,
          lastPage: totalPages,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const getTotalDurationForUser = async (req, res) => {
    const userId = req.user.user_id;
    try {
      const user = await Users.findOne({
        where: { id: userId },
      });
        const result = await Analytics_dashboard.findAll({
            attributes: [
                'user_id',
                [sequelize.fn('SUM', sequelize.col('duration')), 'total_duration']
            ],
            where: {
                user_id: userId
            },
            group: ['user_id']
        });
        const totalDuration =
        parseInt(result[0]?.dataValues?.total_duration, 10) || 0;

      // Update the total duration in the user table
      user.duration_spent = totalDuration;
      await user.save();
        return res.json({ message: "sucess", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
}

const getTotalDurationForRoom = async (req, res) => {
  const userId = req.user.user_id;
  const id = req?.params?.id;
  try {
    const roomsVal = await Rooms.findOne({
      where: { friendly_id: id },
    });
    if(!roomsVal) {
      return res.json({ message: "failed", data: "Room invalid" });
    }
      const result = await Analytics_dashboard.findAll({
          attributes: [
              'user_id',
              [sequelize.fn('SUM', sequelize.col('duration')), 'total_duration']
          ],
          where: {
              user_id: userId,
              meeting_id: roomsVal?.dataValues?.meeting_id
          },
          group: ['user_id']
      });
      // const totalDuration =
      // parseInt(result[0]?.dataValues?.total_duration, 10) || 0;

      roomsVal.room_duration = result?.[0]?.dataValues?.total_duration || 0;
      await roomsVal.save();
      return res.json({ message: "sucess", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
  

  export default {
    postAnalyticsDashboard,
    getAllAnalyticsDashboard,
    getAllByMeetingIdAnalyticsDashboard,
    getTotalDurationForUser,
    getTotalDurationForRoom
  }