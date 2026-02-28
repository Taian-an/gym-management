import  { Schema, model, models } from 'mongoose';

const coachSchema = new Schema({
  name: { type: String, required: true },
  expertise: [{ type: String }] // 修改為陣列型別
}, { timestamps: true });
// 防止 Next.js 在開發時重複編譯 Model
const Coach = models.Coach || model('Coach', coachSchema);

export default Coach;