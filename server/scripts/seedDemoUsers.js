const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const User = require("../models/User");
const Startup = require("../models/Startup");

const demoUsers = [
  { name: "Rajesh V. Sharma", email: "government.demo@innoprocure.test", role: "government", department: "BWSSB" },
  { name: "Dr. Ananya Sen", email: "evaluator.demo@innoprocure.test", role: "evaluator", department: "Technical Evaluation Board" },
  { name: "Vikramaditya Kulkarni", email: "startup.demo@innoprocure.test", role: "startup", department: "AquaSensing Tech Pvt Ltd" },
  { name: "Priya Nair", email: "admin.demo@innoprocure.test", role: "admin", department: "InnoProcure Administration" },
];

async function seedDemoUsers() {
  try {
    await connectDB();
    const passwordHash = await bcrypt.hash("Demo123!", 10);
    for (const demo of demoUsers) {
      const user = await User.findOneAndUpdate(
        { email: demo.email },
        { $set: { ...demo, passwordHash } },
        { new: true, upsert: true, runValidators: true }
      );
      if (demo.role === "startup") {
        await Startup.findOneAndUpdate(
          { userId: user._id },
          { $setOnInsert: { userId: user._id, companyName: demo.department, contactEmail: demo.email } },
          { upsert: true, new: true }
        );
      }
    }
    console.log("Demo accounts ready (all use password Demo123!):");
    for (const { name, email, role } of demoUsers) console.log(`${role}: ${name} <${email}>`);
  } catch (error) {
    console.error("Failed to seed demo accounts:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDemoUsers();
