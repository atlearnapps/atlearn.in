import { Op } from "sequelize";
import Site_settings from "../models/site_settings.js";
import Settings from "../models/settings.js";

async function getSiteSettings(req, res) {
  const { name } = req.body;
  try {
    const siteSettingsValues = await Site_settings.findAll({
      include: [
        {
          model: Settings,
          where: {
            name: {
              [Op.in]: name,
            },
          },
        },
      ],
    });
    if (siteSettingsValues?.length === 0) {
      res.status(404).json({ message: "Site Settings Names Not Found" });
    } else {
      res.send({ message: "success", data: siteSettingsValues });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function patchSiteSettingsById(req, res) {
  const id = req?.params?.id;
  let body = req.body;

  try {
    const siteSettings = await Site_settings.findByPk(id);
    if (!siteSettings) {
      return res.status(404).json({ error: "Site settings not found" });
    }
    if (body?.value) {
      siteSettings.value = body.value;
    }

    await siteSettings.save();

    res.json({ message: "  Site Settings has been updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteSettingsById(req, res) {
  const id = req?.params?.id;

  try {
    const siteSettings = await Site_settings.findByPk(id);
    if (!siteSettings) {
      return res.status(404).json({ error: "Site settings not found" });
    }
 
      siteSettings.value = "";
    

    await siteSettings.save();

    res.json({ message: "  Site Settings has been deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default {
  getSiteSettings,
  patchSiteSettingsById,
  deleteSettingsById
};
