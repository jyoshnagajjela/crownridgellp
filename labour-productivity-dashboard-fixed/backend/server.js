const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const LabourRecord = require("./models/LabourRecord");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Error:", error.message);
  });
  // REGISTER USER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "manager",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

// LOGIN USER
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Crownridge LLP Backend Running Successfully 🚀",
  });
});

// GET all records
app.get("/api/project_labour_productivity", async (req, res) => {
  try {
    const records = await LabourRecord.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch records",
      error: error.message,
    });
  }
});

// GET single record
app.get("/api/project_labour_productivity/:id", async (req, res) => {
  try {
    const record = await LabourRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid record ID",
      error: error.message,
    });
  }
});

// POST create new record
app.post("/api/project_labour_productivity", async (req, res) => {
  try {
    const {
      siteName,
      date,
      tradeType,
      totalWorkers,
      presentWorkers,
      tasksAssigned,
      tasksCompleted,
      workingHours,
      remarks,
      status,
    } = req.body;

    if (!siteName || !date || !tradeType) {
      return res.status(400).json({
        success: false,
        message: "Site name, date, and trade type are required",
      });
    }

    const total = Number(totalWorkers) || 0;
    const present = Number(presentWorkers) || 0;
    const absent = total >= present ? total - present : 0;

    const newRecord = await LabourRecord.create({
      siteName,
      date,
      tradeType,
      totalWorkers: total,
      presentWorkers: present,
      absentWorkers: absent,
      tasksAssigned: Number(tasksAssigned) || 0,
      tasksCompleted: Number(tasksCompleted) || 0,
      workingHours: Number(workingHours) || 0,
      remarks: remarks || "",
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      message: "Labour record created successfully",
      data: newRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create record",
      error: error.message,
    });
  }
});

// PUT update record
app.put("/api/project_labour_productivity/:id", async (req, res) => {
  try {
    const existingRecord = await LabourRecord.findById(req.params.id);

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    const updatedData = {
      ...req.body,
    };

    const total = Number(updatedData.totalWorkers ?? existingRecord.totalWorkers) || 0;
    const present = Number(updatedData.presentWorkers ?? existingRecord.presentWorkers) || 0;

    updatedData.totalWorkers = total;
    updatedData.presentWorkers = present;
    updatedData.absentWorkers = total >= present ? total - present : 0;
    updatedData.tasksAssigned = Number(updatedData.tasksAssigned ?? existingRecord.tasksAssigned) || 0;
    updatedData.tasksCompleted = Number(updatedData.tasksCompleted ?? existingRecord.tasksCompleted) || 0;
    updatedData.workingHours = Number(updatedData.workingHours ?? existingRecord.workingHours) || 0;

    const updatedRecord = await LabourRecord.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Labour record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update record",
      error: error.message,
    });
  }
});

// DELETE record
app.delete("/api/project_labour_productivity/:id", async (req, res) => {
  try {
    const deletedRecord = await LabourRecord.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      message: "Labour record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete record",
      error: error.message,
    });
  }
});

// Reports summary API
app.get("/api/reports/summary", async (req, res) => {
  try {
    const records = await LabourRecord.find();

    const totalWorkforce = records.reduce(
      (sum, r) => sum + (Number(r.totalWorkers) || 0),
      0
    );
    const presentWorkers = records.reduce(
      (sum, r) => sum + (Number(r.presentWorkers) || 0),
      0
    );
    const absentWorkers = records.reduce(
      (sum, r) => sum + (Number(r.absentWorkers) || 0),
      0
    );
    const tasksAssigned = records.reduce(
      (sum, r) => sum + (Number(r.tasksAssigned) || 0),
      0
    );
    const tasksCompleted = records.reduce(
      (sum, r) => sum + (Number(r.tasksCompleted) || 0),
      0
    );

    const productivityRate =
      tasksAssigned > 0
        ? ((tasksCompleted / tasksAssigned) * 100).toFixed(1)
        : "0.0";

    const absenteeismRate =
      totalWorkforce > 0
        ? ((absentWorkers / totalWorkforce) * 100).toFixed(1)
        : "0.0";

    res.json({
      success: true,
      data: {
        totalWorkforce,
        presentWorkers,
        absentWorkers,
        tasksAssigned,
        tasksCompleted,
        productivityRate,
        absenteeismRate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate report summary",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});