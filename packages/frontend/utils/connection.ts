import mongoose, { Model } from 'mongoose'

const { DATABASE_URL } = process.env

export const dbConnect = async () => {
  try {
    const conn = await mongoose
      .connect(DATABASE_URL.toString())
      .catch((err) => console.log(err))
    return conn
  } catch (error) {
    console.log('DATABASE ERRROR', error)
    return null
  }
}
