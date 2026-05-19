const mongoose = require("mongoose");

const treatmentPlanSchema = new mongoose.Schema(
  {
    // this connects a treatment plan to one client
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client ID is required"]
    },
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      enum: ["Custom Facial", "Chemical Peel", "Microchanneling", "LED Therapy"]
    },
    sessions: {
      type: Number,
      required: [true, "Number of sessions is required"],
      min: [1, "Sessions must be at least 1"],
      max: [12, "Sessions cannot be more than 12"]
    },
    price: {
      type: Number,
      required: [true, "Treatment price is required"],
      min: [0, "Price cannot be negative"]
    },
    treatmentDate: {
      type: Date,
      required: [true, "Treatment date is required"]
    }
  },
  {
    timestamps: true
  }
);

// treatment plan collection/model
module.exports = mongoose.model("TreatmentPlan", treatmentPlanSchema);