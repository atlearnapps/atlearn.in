import { where } from "sequelize";
import AddonPlan from "../models/add_on_plan.js";
import Pricing from "../models/pricing.js";

async function getPricing(req, res) {
  try {
    const pricing = await Pricing.findAll({
      order: [["price", "ASC"]],
    });
    if (pricing) {
      res.send({ data: pricing });
    } else {
      res.send({ message: "not have pricing" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function updatePlans(req, res) {
  try {
    const pricingOptions = req.body;
    // console.log(pricingOptions);
    const result = await Pricing.update(pricingOptions, {
      where: { id: pricingOptions.id },
    });

    res.send({ message: "success", success: true });
  } catch (error) {
    res.status(500).json(error);
  }
}
async function createPlan(req, res) {
  try {
    const newPricing = req.body;

    // Validate and sanitize newPricing data if needed

    const createdPricing = await Pricing.create(newPricing);

    res.status(201).json({
      message: "Pricing plan created successfully",
      data: createdPricing,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function deletePlan(req, res) {
  try {
    const pricingId = req.params.id;

    // Validate and sanitize pricingId if needed

    const deletedPricing = await Pricing.destroy({ where: { id: pricingId } });

    if (deletedPricing) {
      res.json({ message: "Pricing plan deleted successfully", success: true });
    } else {
      res.status(404).json({ message: "Pricing plan not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
async function getAddonPlan(req, res) {
  try {
    const addonPlan = await AddonPlan.findAll();
    if (!addonPlan?.length) {
      res.status(200).json({ success: false, message: "Addon Plan Not Found" });
    }
    res.status(200).json({ success: true, data: addonPlan });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}
async function updateAddonPlan(req, res) {
  try {
    const addonDetails = req.body;
    const durationAddonPlan = await AddonPlan.findOne({
      where: { add_on_plan_name: "duration" },
    });

    const storageAddonPlan = await AddonPlan.findOne({
      where: {
        add_on_plan_name: "storage",
      },
    });

    if (durationAddonPlan?.length === 0) {
      res
        .status(200)
        .json({ success: false, message: "Addon Duration Plan Not Found" });
    }
    if (storageAddonPlan?.length === 0) {
      res
        .status(200)
        .json({ success: false, message: "Addon Storage Plan Not Found" });
    }
    console.log(durationAddonPlan, "durationAddonPlan");

    // // Update the addon plan fields
    durationAddonPlan.min_range = addonDetails?.duration_min_range;
    durationAddonPlan.max_range = addonDetails?.duration_max_range;
    durationAddonPlan.price = addonDetails?.price_per_duration;
    storageAddonPlan.max_range = addonDetails?.storage_min_range;
    storageAddonPlan.max_range = addonDetails?.storage_max_range;
    storageAddonPlan.price = addonDetails?.price_per_storage;
    await durationAddonPlan.save();
    await storageAddonPlan.save();
    res
      .status(200)
      .json({ success: true, message: "Addon Plan updated successfully" });
  } catch (error) {
    res.status(200).json({ message: "Internal server error", error });
  }
}

export default {
  getPricing,
  updatePlans,
  createPlan,
  deletePlan,
  getAddonPlan,
  updateAddonPlan,
};
