// src/models/Course.ts
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  capacity: { type: Number, required: true, default: 10 },
  time: { type: String, required: true }, // 確保這是 String 或 Date
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);