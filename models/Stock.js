import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// USER SCHEMA
const stockSchema = mongoose.Schema(
  {
    ticker: {
      type: String,
    },

    stockName: {
      type: String,
    },

    units: {
      type: Number,
    },

    currentPrice: {
      type: Number,
    },

    peRatio: {
      type: Number,
    },

    eps: {
      type: Number,
    },

    priceEPS: {
      type: Number,
    },

    priceToBook: {
      type: Number,
    },

    divYield: {
      type: Number,
    },

    dateTime: {
      type: Date,
    },

    totalValue: {
      type: Number,
    },

    percentChange: {
      type: Number,
    },  

    currency: {
      type: String,
    },

    sharesOutstanding: {
      type: Number,
    },  

    bookValue: {
      type: Number,
    },  
  }

);

// add plugin that converts mongoose to json
stockSchema.plugin(toJSON);

export default mongoose.models.Stock || mongoose.model("Stock", stockSchema);