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

    //I think this should be removed - did not have time to check if it breaks something but I don't think so
    totalValue: {
      type: String,
    },

    percentChange: {
      type: Number,
    },  

    currency: {
      type: String,
    },

    sharesOutstanding: {
      type: String,
    },  

    bookValue: {
      type: Number,
    },  
  }

);

// add plugin that converts mongoose to json
stockSchema.plugin(toJSON);

export default mongoose.models.Stock || mongoose.model("Stock", stockSchema);