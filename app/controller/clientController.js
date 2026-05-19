const Client = require("../models/clientModel");

// get all clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();

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

    const client = await Client.findById(id);

    if (!client) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Client not found"
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

    res
      .status(201)
      .json({
        success: true,
        message: "Client created successfully",
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

// update client by id
const updateClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!client) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Client not found"
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Client updated successfully",
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

    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Client not found"
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Client deleted successfully",
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