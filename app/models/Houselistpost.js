//app/models/Houselistpost.js
import mongoose, { Schema, model, models } from 'mongoose';

const houselistpostSchema = new Schema({
  img: {
    type: [String], 
    required: true,
  },
  propertyname: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  features: {
    bedrooms: { type: String, required: true },
    bathrooms: { type: String, required: true },
    size: { type: String, required: true },
  },
  viewdetails: {
    type: String,
    required: true,
  },
  isFeatured: {
      type: Boolean,
      default: false,
  },
   description: {
    type: String,
    required: true,
  },
  propertytype: {
    type: String,
    required: true,
  },
  coordinates: { 
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  agentName: {
    type: String,
    required: false, 
  },
  agentContactEmail: {
    type: String,
    required: false,
  },
  agentContactPhone: {
    type: String,
    required: false,
  },
   favoritesCount: {
    type: Number,
    default: 0,
    required: true,
  },
}, { timestamps: true });

const Houselistpost = models.Houselistpost || model('Houselistpost', houselistpostSchema);

export default Houselistpost;