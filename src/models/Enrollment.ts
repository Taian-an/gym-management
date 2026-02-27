import mongoose, { Schema, model, models } from 'mongoose';

const EnrollmentSchema = new Schema({
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  enrollDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// 防止重複報名：同一個會員不能報名同一個課程兩次
EnrollmentSchema.index({ memberId: 1, courseId: 1 }, { unique: true });

export default models.Enrollment || model('Enrollment', EnrollmentSchema);