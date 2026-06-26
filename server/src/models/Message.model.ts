import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  _id: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  subject: string;
  message: string;
  type: 'direct_message' | 'reminder' | 'system';
  isRead: boolean;
  readAt?: Date;
  appointmentId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['direct_message', 'reminder', 'system'],
      default: 'direct_message',
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  },
  { timestamps: true }
);

messageSchema.index({ toUserId: 1, isRead: 1 });
messageSchema.index({ createdAt: -1 });

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);
