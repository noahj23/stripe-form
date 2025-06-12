require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// ✅ Allow both GitHub Pages and custom domain
app.use(cors({
  origin: [
    "https://noahj23.github.io",
    "https://pay.droplyservices.com"
  ]
}));

app.use(express.json());

app.post("/create-setup-intent", async (req, res) => {
  try {
    console.log("✅ POST /create-setup-intent received");

    const { email } = req.body;
    console.log("📩 Email received:", email);

    if (!email) {
      console.error("❌ No email provided");
      return res.status(400).send({ error: "Email is required" });
    }

    const customer = await stripe.customers.create({ email });
    console.log("✅ Customer created:", customer.id);

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    console.log("🎯 SetupIntent created:", setupIntent.id);

    res.send({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    res.status(500).send({ error: err.message });
  }
});

app.listen(4242, () => console.log("🚀 Stripe backend running on port 4242"));

