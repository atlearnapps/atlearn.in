import { Op } from "sequelize";
import Meeting_options from "../models/meeting_options.js";
import Rooms_configurations from "../models/rooms_configurations.js";

async function getAllRoomConfig(req, res) {
  //   const { name } = req.body; 
  try {
    const roomConfigValues = await Rooms_configurations.findAll({
      include: [
        {
          model: Meeting_options,
        },
      ],
    });
    if (roomConfigValues?.length === 0) {
      res.status(404).json({ message: "Site Settings Names Not Found" });
    } else {
      res.send({ message: "success", data: roomConfigValues });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function patchRoomConfigById(req, res) {
    const id = req?.params?.id;
    let body = req.body;
    try {
      const roomConfigValues = await Rooms_configurations.findByPk(id);
      if (!roomConfigValues) {
        return res.status(404).json({ error: "Room configuration not found" });
      }
      if(body?.value) {
        roomConfigValues.value = body.value
      }
      
      await roomConfigValues.save();
  
      res.json({  message: " The room configuration has been updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

export default {
    getAllRoomConfig,
    patchRoomConfigById,
};
