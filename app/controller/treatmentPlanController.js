const TreatmentPlan = require("../models/treatmentPlanModel");
const Client = require("../models/clientModel");
const messages = require("../messages/messages");

// get all treatment plans and show client info
const getAllTreatmentPlans = async (req, res) => {
  try {
    const treatmentPlans = await TreatmentPlan.find()
      .select("-__v")
      .populate("client", "-__v");

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

    const treatmentPlan = await TreatmentPlan.findById(id)
      .select("-__v")
      .populate("client", "-__v");

    if (!treatmentPlan) {
      return res
        .status(404)
        .json({
          success: false,
          message: messages.treatmentPlanNotFound
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

// create a treatment plan using a real client id
const createTreatmentPlan = async (req, res) => {
  try {
    const { client } = req.body;

    const existingClient = await Client.findById(client);

    if (!existingClient) {
      return res
        .status(404)
        .json({
          success: false,
          message: messages.invalidClientId
        });
    }

    const treatmentPlan = await TreatmentPlan.create(req.body);

    const populatedTreatmentPlan = await TreatmentPlan.findById(treatmentPlan._id)
      .select("-__v")
      .populate("client", "-__v");

    res
      .status(201)
      .json({
        success: true,
        message: messages.treatmentPlanCreated,
        data: populatedTreatmentPlan
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

    const existingTreatmentPlan = await TreatmentPlan.findById(id);

    if (!existingTreatmentPlan) {
      return res
        .status(404)
        .json({
          success: false,
          message: messages.treatmentPlanNotFound
        });
    }

    if (req.body.client) {
      const existingClient = await Client.findById(req.body.client);

      if (!existingClient) {
        return res
          .status(404)
          .json({
            success: false,
            message: messages.invalidClientId
          });
      }
    }

    const treatmentPlan = await TreatmentPlan.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .select("-__v")
      .populate("client", "-__v");

    res
      .status(200)
      .json({
        success: true,
        message: messages.treatmentPlanUpdated,
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

    const existingTreatmentPlan = await TreatmentPlan.findById(id);

    if (!existingTreatmentPlan) {
      return res
        .status(404)
        .json({
          success: false,
          message: messages.treatmentPlanNotFound
        });
    }

    const treatmentPlan = await TreatmentPlan.findByIdAndDelete(id)
      .select("-__v")
      .populate("client", "-__v");

    res
      .status(200)
      .json({
        success: true,
        message: messages.treatmentPlanDeleted,
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