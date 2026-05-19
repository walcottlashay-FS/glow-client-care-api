const router = require("express").Router();

const {
  getAllClients,
  getClientById,
  createClient,
  updateClientById,
  deleteClientById
} = require("../controller/clientController");

// client CRUD routes
router.get("/", getAllClients);

router.get("/:id", getClientById);

router.post("/", createClient);

router.put("/:id", updateClientById);

router.delete("/:id", deleteClientById);

module.exports = router;