import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { sendNewUserNotification } from "@/utils/sendNewUserNotification";

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
      stockName: String,
      units: Number
    }],

    generalAnalysis: {
      gptResponse: String,
      timeStamp: Number
    },
    analysisRefreshes: {
      count: {
        type: Number,
        default: 0
      },
      lastRefreshDate: {
        type: Date,
        default: Date.now
      }
    },
    lastOnline: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

// Send email notification when a new user is created
userSchema.post('save', async function(doc, next) {
  if (this.isNew) {
    // This is a new user
    try {
      await sendNewUserNotification(doc);
      console.log('New user notification sent.');
    } catch (error) {
      console.error('Failed to send new user notification:', error);
    }
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
