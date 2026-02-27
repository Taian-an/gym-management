import mongoose, { Schema, model, models } from 'mongoose';

const CourseSchema = new Schema({
  title: { type: String, required: true },
  capacity: { type: Number, default: 10 },
  // 建立與 Coach 的關聯
  coachId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Coach' 
  },
}, { timestamps: true });

export default models.Course || model('Course', CourseSchema);