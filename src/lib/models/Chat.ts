import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  messages: [MessageSchema]
}, {
  timestamps: true
});

export const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema); 