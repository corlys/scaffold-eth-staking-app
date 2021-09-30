import mongoose from 'mongoose'

export interface ContractDocument extends mongoose.Document {
  contractAddress: string
  creator: string
}

const ContractSchema = new mongoose.Schema({
  contractAddress: String,
  creator: String,
})

export const Contract =
  mongoose.models.Contract ||
  mongoose.model<ContractDocument>('Contract', ContractSchema)
// export default mongoose.models.User ||
//   mongoose.model('Contract', ContractSchema)
