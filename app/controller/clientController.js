const Client = require("../models/clientModel");
const messages = require("../messages/messages");

// get all clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().select("-__v");

    res
      .status(200)
      .json({
        success: true,
        count: clients.length,
        data: clients
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

// get one client by id
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id).select("-__v");

    if (!client) {
      return res
        .status(404)
        .json({
          success: false,
          message: messages.clientNotFound
        });
    }

    res
      .status(200)
      .json({
        success: true,
        data: client
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

// create a new client
const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);

    const newClient = await Client.findById(client._id).select("-__v");

    res
      .status(201)
      .json({
        success: true,
        message: messages.clientCreated,
        data: newClient
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

// update client by id
const updateClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const existingClient = await Client.findById(id);

    if (!existingClient) {
      return res
        .status(404)
        .json({
          success: false,
          message: messages.clientNotFound
        });
    }

    const client = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).select("-__v");

    res
      .status(200)
      .json({
        success: true,
        message: messages.clientUpdated,
        data: client
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

// delete client by id
const deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const existingClient = await Client.findById(id);

    if (!existingClient) {
      return res
        .status(404)
        .json({
          success: false,
          message: messages.clientNotFound
        });
    }

    const client = await Client.findByIdAndDelete(id).select("-__v");

    res
      .status(200)
      .json({
        success: true,
        message: messages.clientDeleted,
        data: client
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
  getAllClients,
  getClientById,
  createClient,
  updateClientById,
  deleteClientById
};