const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Client first name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"]
    },
    email: {
      type: String,
      required: [true, "Client email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    age: {
      type: Number,
      required: [true, "Client age is required"],
      min: [13, "Client must be at least 13"],
      max: [100, "Client age cannot be over 100"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    skinConcerns: {
      type: [String],
      required: [true, "At least one skin concern is required"],
      enum: ["acne", "hyperpigmentation", "dryness", "aging", "sensitivity"]
    },
    // connects client back to their treatment plans
    treatmentPlans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TreatmentPlan"
      }
    ]
  },
  {
    timestamps: true
  }
);

// client collection/model
module.exports = mongoose.model("Client", clientSchema);