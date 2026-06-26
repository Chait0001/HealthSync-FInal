import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true },
  message:  { type: String, required: true },
  type:     { type: String, enum: ['reminder', 'approval', 'cancellation', 'general'], default: 'general' },
  isRead:   { type: Boolean, default: false },
  appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  sentViaSocket: { type: Boolean, default: false },
  deliveredAt:   { type: Date },
  readAt:        { type: Date },
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const NotificationModel = mongoose.model('Notification', notificationSchema);
