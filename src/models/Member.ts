import { Schema, model, models } from 'mongoose';

const MemberSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  joinDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Member = models.Member || model('Member', MemberSchema);
export default Member;