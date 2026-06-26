const mongoose = require("mongoose");

const labourRecordSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  tradeType: {
    type: String,
    required: true
  },
  totalWorkers: Number,
  presentWorkers: Number,
  absentWorkers: Number,
  tasksAssigned: Number,
  tasksCompleted: Number,
  workingHours: Number,
  remarks: String,
  status: {
    type: String,
    default: "active"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("LabourRecord", labourRecordSchema);