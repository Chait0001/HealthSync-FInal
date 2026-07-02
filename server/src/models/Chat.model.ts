import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  conversationId: string;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    conversationId: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes for fast lookup and unread aggregation
chatMessageSchema.index({ conversationId: 1, createdAt: 1 });
chatMessageSchema.index({ receiverId: 1, isRead: 1 });

export const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

/**
 * Pure helper function to get a deterministic conversation ID.
 * Sorts two user IDs lexicographically and joins them with an underscore.
 */
export function getConversationId(userIdA: string, userIdB: string): string {
  const sorted = [userIdA.toString(), userIdB.toString()].sort();
  return `${sorted[0]}_${sorted[1]}`;
}
