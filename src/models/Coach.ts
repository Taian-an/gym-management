import  { Schema, model, models } from 'mongoose';

const CoachSchema = new Schema({
  name: { type: String, required: true },
  expertise: { type: String, required: true }, // 專長，例如：重訓、瑜珈
  phone: { type: String },
  email: { type: String, unique: true },
}, { timestamps: true }); // 自動加入 createdAt 和 updatedAt

// 防止 Next.js 在開發時重複編譯 Model
const Coach = models.Coach || model('Coach', CoachSchema);

export default Coach;