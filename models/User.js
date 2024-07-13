import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// USER SCHEMA
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
    },
    image: {
      type: String,
    },
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value) {
        return value.includes("cus_");
      },
    },
    // Used in the Snaptrade SDK to identify the user in Snaptrade
    snaptrade_user_secret: {
      type: String,
    },
    // Used in the Snaptrade SDK to identify the user in Snaptrade
    importedWallet: {
      type: Boolean,
    },

    portfolioAccountId: {
      type: String,
    },

    // Used in the Stripe webhook. should match a plan in config.js file.
    priceId: {
      type: String,
      validate(value) {
        return value.includes("price_");
      },
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },

    portfolio: [{
      ticker: String,
      units: Number
    }],

    generalAnalysis: {
      gptResponse: String,
      timeStamp: Number
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);



// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema);
