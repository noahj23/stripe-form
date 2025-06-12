require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-setup-intent", async (req, res) => {
  try {
    const { email } = req.body;

    const customer = await stripe.customers.create({ email });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    res.send({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(4242, () => console.log("Stripe backend running on port 4242"));

