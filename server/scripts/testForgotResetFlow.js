const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const apiUrl = (process.env.TEST_API_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/$/, "");
const email = String(process.env.TEST_RESET_EMAIL || "government.demo@innoprocure.test").trim().toLowerCase();
const password = process.env.TEST_RESET_PASSWORD || "Demo123!";

async function post(pathname, body) {
    const response = await fetch(`${apiUrl}${pathname}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(`${pathname} failed (${response.status}): ${result.message || response.statusText}`);
    }
    return result;
}

async function testForgotResetFlow() {
    if (process.env.NODE_ENV === "production") throw new Error("This flow test is for local development only.");
    if (!email.endsWith("@innoprocure.test")) throw new Error("Use a seeded @innoprocure.test demo account for this test.");

    console.info(`Requesting a development reset link for ${email}...`);
    const request = await post("/api/auth/forgot-password", { email });
    if (!request.developmentResetUrl) {
        throw new Error("No development reset URL returned. Check that the demo account exists in MongoDB.");
    }

    const token = new URL(request.developmentResetUrl).searchParams.get("token");
    if (!token) throw new Error("The development reset URL did not contain a token.");

    await post("/api/auth/reset-password", { token, password });
    await post("/api/auth/login", { email, password });
    console.info("Forgot-password flow passed: token accepted and login succeeded.");
}

testForgotResetFlow().catch((error) => {
    console.error("Forgot-password flow failed:", error.message);
    process.exitCode = 1;
});
