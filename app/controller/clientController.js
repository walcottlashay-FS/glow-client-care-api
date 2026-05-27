const Client = require("../models/clientModel");
const messages = require("../Messages/messages");

// get all clients with query operators, select, sort, and pagination
const getAllClients = async (req, res) => {
  try {
    const {
      minAge,
      maxAge,
      skinConcern,
      isActive,
      firstName,
      exclude,
      sort,
      page = 1,
      limit = 5
    } = req.query;

    const filter = {};

    // Mongo query operators: $gte and $lte
    if (minAge || maxAge) {
      filter.age = {};

      if (minAge) {
        filter.age.$gte = Number(minAge);
      }

      if (maxAge) {
        filter.age.$lte = Number(maxAge);
      }
    }

    // Mongo query operator: $in
    if (skinConcern) {
      filter.skinConcerns = {
        $in: skinConcern.split(",")
      };
    }

    // Boolean filter
    if (isActive) {
      filter.isActive = isActive === "true";
    }

    // Mongo query operator: $regex
    if (firstName) {
      filter.firstName = {
        $regex: firstName,
        $options: "i"
      };
    }

    // select can exclude fields from the response
    const selectFields = exclude
      ? exclude.split(",").map((field) => `-${field}`).join(" ")
      : "-__v";

    // sort results
    const sortFields = sort ? sort.split(",").join(" ") : "firstName";

    // pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const clients = await Client.find(filter)
      .select(selectFields)
      .populate("treatmentPlans", "-__v")
      .sort(sortFields)
      .skip(skip)
      .limit(limitNumber);

    const totalClients = await Client.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: clients.length,
      total: totalClients,
      page: pageNumber,
      pages: Math.ceil(totalClients / limitNumber),
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// get one client by id and populate their treatment plans
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .select("-__v")
      .populate("treatmentPlans", "-__v");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: messages.clientNotFound
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// create a new client
const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);

    res.status(201).json({
      success: true,
      message: messages.clientCreated,
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// update client by id
const updateClientById = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .select("-__v")
      .populate("treatmentPlans", "-__v");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: messages.clientNotFound
      });
    }

    res.status(200).json({
      success: true,
      message: messages.clientUpdated,
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// delete client by id
const deleteClientById = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id).select("-__v");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: messages.clientNotFound
      });
    }

    res.status(200).json({
      success: true,
      message: messages.clientDeleted,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClientById,
  deleteClientById
};
