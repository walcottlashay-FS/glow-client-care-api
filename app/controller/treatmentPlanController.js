const TreatmentPlan = require("../models/treatmentPlanModel");

// get all treatment plans
const getAllTreatmentPlans = async (req, res) => {
  try {
    const treatmentPlans = await TreatmentPlan.find().populate("client", "firstName email");

    res
      .status(200)
      .json({
        success: true,
        count: treatmentPlans.length,
        data: treatmentPlans
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message
      });
  }
};

// get one treatment plan by id
const getTreatmentPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const treatmentPlan = await TreatmentPlan.findById(id).populate("client", "firstName email");

    if (!treatmentPlan) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Treatment plan not found"
        });
    }

    res
      .status(200)
      .json({
        success: true,
        data: treatmentPlan
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message
      });
  }
};

// create a new treatment plan
const createTreatmentPlan = async (req, res) => {
  try {
    const treatmentPlan = await TreatmentPlan.create(req.body);

    res
      .status(201)
      .json({
        success: true,
        message: "Treatment plan created successfully",
        data: treatmentPlan
      });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: error.message
      });
  }
};

// update treatment plan by id
const updateTreatmentPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const treatmentPlan = await TreatmentPlan.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!treatmentPlan) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Treatment plan not found"
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Treatment plan updated successfully",
        data: treatmentPlan
      });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: error.message
      });
  }
};

// delete treatment plan by id
const deleteTreatmentPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const treatmentPlan = await TreatmentPlan.findByIdAndDelete(id);

    if (!treatmentPlan) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Treatment plan not found"
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Treatment plan deleted successfully",
        data: treatmentPlan
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message
      });
  }
};

module.exports = {
  getAllTreatmentPlans,
  getTreatmentPlanById,
  createTreatmentPlan,
  updateTreatmentPlanById,
  deleteTreatmentPlanById
};