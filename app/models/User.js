import { Schema, model, models } from 'mongoose';


const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  agreeTS: {
    type: Boolean,  
    required: true, 
  },
  dateOfBirth: { 
    type: Date,
    required: false, 
  },
  favoritePosts: [
   {
     type: Schema.Types.ObjectId,
     ref: 'Houselistpost',
   },
    ],
      isSubscribedToNewsletter: {
    type: Boolean,
    default: true, 
  },
    lastNamesUpdate: {
    type: Date,
    required: false, 
  },
   role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user', 
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true }
);


const User = models.User || model('User', userSchema);
export default User;