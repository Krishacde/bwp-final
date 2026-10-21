const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Startup = require("../models/Startup");

const VALID_ROLES = ["government", "evaluator", "startup", "admin"];
const SIGNUP_REQUIRED_FIELDS = ["name", "email", "password", "role"];

function toUserProfile(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

function signToken(user) {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

exports.register = async (req, res) => {
    try {
        const body = req.body || {};

        const missingFields = SIGNUP_REQUIRED_FIELDS.filter((field) => {
            const value = body[field];
            return value === undefined || value === null || String(value).trim() === "";
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                missingFields
            });
        }

        const role = String(body.role).trim().toLowerCase();
        // Public registration is limited to startup accounts. Privileged accounts
        // must be provisioned by an administrator.
        if (role !== "startup") {
            return res.status(400).json({
                message: "Public registration is available for startup accounts only"
            });
        }

        const email = String(body.email).trim().toLowerCase();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const password = String(body.password);
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: String(body.name).trim(),
            email,
            passwordHash,
            role,
            department: body.department ? String(body.department).trim() : undefined,
            designation: body.designation ? String(body.designation).trim() : undefined,
            avatar: body.avatar ? String(body.avatar).trim() : undefined
        });

        if (role === "startup") {
            await Startup.create({
                userId: user._id,
                companyName: body.department ? String(body.department).trim() : `${user.name} Ventures`,
                contactEmail: user.email
            });
        }

        const createdUser = await User.findById(user._id).select("-passwordHash");
        const token = signToken(createdUser);

        return res.status(201).json({
            token,
            user: toUserProfile(createdUser)
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid or missing request data",
                details: error.message
            });
        }

        console.error("Register error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: String(email).trim().toLowerCase() });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = signToken(user);

        return res.status(200).json({
            token,
            user: toUserProfile(user)
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

exports.me = async (req, res) => res.status(200).json({ user: toUserProfile(req.user) });

exports.requestPasswordReset = async (req, res) => {
    try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Enter a valid email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "No account found for that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const appUrl = (process.env.APP_URL || "http://localhost:5173").replace(/\/$/, "");
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

        return res.status(200).json({
            resetUrl
        });
    } catch (error) {
        console.error("Password reset request failed:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
    const { token, password } = req.body || {};
    if (!token || typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ message: "Enter a new password with at least 6 characters" });
    }

    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ message: "Reset link is invalid or expired" });

    user.passwordHash = await bcrypt.hash(password, 10);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
        return res.status(200).json({ message: "Password updated" });
    } catch (error) {
        console.error("Password reset failed:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.changePassword = async (req, res) => {
    try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof newPassword !== "string" || newPassword.length < 6) {
        return res.status(400).json({ message: "New password must have at least 6 characters" });
    }
    const user = await User.findById(req.user._id);
    const matches = user && await bcrypt.compare(String(currentPassword || ""), user.passwordHash);
    if (!matches) return res.status(400).json({ message: "Current password is incorrect" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
        return res.status(200).json({ message: "Password updated" });
    } catch (error) {
        console.error("Password change failed:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
