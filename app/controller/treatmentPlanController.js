const TreatmentPlan = require("../models/treatmentPlanModel");
const Client = require("../models/clientModel");
const messages = require("../Messages/messages");

// hide email when client info is populated inside treatment plans
const clientPopulateOptions = {
  path: "client",
  select: "-email -__v"
};

// get all treatment plans with query operators, select, sort, and pagination
const getAllTreatmentPlans = async (req, res) => {
  try {
    const {
      serviceName,
      minSessions,
      maxSessions,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      exclude,
      sort,
      page = 1,
      limit = 5
    } = req.query;

    const filter = {};

    // Mongo query operator: $regex
    if (serviceName) {
      filter.serviceName = {
        $regex: serviceName,
        $options: "i"
      };
    }

    // Mongo query operators: $gte and $lte
    if (minSessions || maxSessions) {
      filter.sessions = {};

      if (minSessions) {
        filter.sessions.$gte = Number(minSessions);
      }

      if (maxSessions) {
        filter.sessions.$lte = Number(maxSessions);
      }
    }

    // Mongo query operators: $gte and $lte
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Mongo query operators: $gte and $lte for dates
    if (startDate || endDate) {
      filter.treatmentDate = {};

      if (startDate) {
        filter.treatmentDate.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.treatmentDate.$lte = new Date(endDate);
      }
    }

    // select can exclude fields from the response
    const selectFields = exclude
      ? exclude.split(",").map((field) => `-${field}`).join(" ")
      : "-__v";

    // sort results
    const sortFields = sort ? sort.split(",").join(" ") : "treatmentDate";

    // pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const treatmentPlans = await TreatmentPlan.find(filter)
      .select(selectFields)
      .populate(clientPopulateOptions)
      .sort(sortFields)
      .skip(skip)
      .limit(limitNumber);

    const totalTreatmentPlans = await TreatmentPlan.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: treatmentPlans.length,
      total: totalTreatmentPlans,
      page: pageNumber,
      pages: Math.ceil(totalTreatmentPlans / limitNumber),
      data: treatmentPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// get one treatment plan by id and show client info
const getTreatmentPlanById = async (req, res) => {
  try {
    const treatmentPlan = await TreatmentPlan.findById(req.params.id)
      .select("-__v")
      .populate(clientPopulateOptions);

    if (!treatmentPlan) {
      return res.status(404).json({
        success: false,
        message: messages.treatmentPlanNotFound
      });
    }

    res.status(200).json({
      success: true,
      data: treatmentPlan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// create a treatment plan and connect it to a client
const createTreatmentPlan = async (req, res) => {
  try {
    const existingClient = await Client.findById(req.body.client);

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: messages.invalidClientId
      });
    }

    const treatmentPlan = await TreatmentPlan.create(req.body);

    // add this treatment plan to the client's treatmentPlans array
    await Client.findByIdAndUpdate(req.body.client, {
      $addToSet: { treatmentPlans: treatmentPlan._id }
    });

    const populatedTreatmentPlan = await TreatmentPlan.findById(treatmentPlan._id)
      .select("-__v")
      .populate(clientPopulateOptions);

    res.status(201).json({
      success: true,
      message: messages.treatmentPlanCreated,
      data: populatedTreatmentPlan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// update treatment plan by id
const updateTreatmentPlanById = async (req, res) => {
  try {
    const existingTreatmentPlan = await TreatmentPlan.findById(req.params.id);

    if (!existingTreatmentPlan) {
      return res.status(404).json({
        success: false,
        message: messages.treatmentPlanNotFound
      });
    }

    if (req.body.client) {
      const existingClient = await Client.findById(req.body.client);

      if (!existingClient) {
        return res.status(404).json({
          success: false,
          message: messages.invalidClientId
        });
      }
    }

    const treatmentPlan = await TreatmentPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .select("-__v")
      .populate(clientPopulateOptions);

    if (req.body.client) {
      await Client.findByIdAndUpdate(req.body.client, {
        $addToSet: { treatmentPlans: treatmentPlan._id }
      });
    }

    res.status(200).json({
      success: true,
      message: messages.treatmentPlanUpdated,
      data: treatmentPlan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// delete treatment plan by id
const deleteTreatmentPlanById = async (req, res) => {
  try {
    const treatmentPlan = await TreatmentPlan.findByIdAndDelete(req.params.id)
      .select("-__v")
      .populate(clientPopulateOptions);

    if (!treatmentPlan) {
      return res.status(404).json({
        success: false,
        message: messages.treatmentPlanNotFound
      });
    }

    // remove this treatment plan from the client's treatmentPlans array
    await Client.findByIdAndUpdate(treatmentPlan.client._id, {
      $pull: { treatmentPlans: treatmentPlan._id }
    });

    res.status(200).json({
      success: true,
      message: messages.treatmentPlanDeleted,
      data: treatmentPlan
    });
  } catch (error) {
    res.status(500).json({
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