// app/models/Testimonial.js
import { Schema, model, models } from 'mongoose';

const testimonialSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500, 
  },
}, { timestamps: true }); 

const Testimonial = models.Testimonial || model('Testimonial', testimonialSchema);

export default Testimonial;