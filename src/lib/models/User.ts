// import mongoose from 'mongoose';

import { Chat } from "./Chat";

// import { Chat } from "./Chat";

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   image: String,
//   chats: [{
//     chatTitle: String,
//     threadId: String
//   }]
// }, {
//   timestamps: true
// });

// export const User = mongoose.models.User || mongoose.model('User', UserSchema); 
export interface User {
  name: string;
  email: string;
  image: string;
  chats: Chat[];
}
