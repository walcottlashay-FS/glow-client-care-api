const router = require("express").Router();
// routes for creating, reading, updating, and deleting treatment plans
const {
  getAllTreatmentPlans,
  getTreatmentPlanById,
  createTreatmentPlan,
  updateTreatmentPlanById,
  deleteTreatmentPlanById
} = require("../controller/treatmentPlanController");

// treatment plan CRUD routes
router.get("/", getAllTreatmentPlans);

router.get("/:id", getTreatmentPlanById);

router.post("/", createTreatmentPlan);

router.put("/:id", updateTreatmentPlanById);

router.delete("/:id", deleteTreatmentPlanById);

module.exports = router;