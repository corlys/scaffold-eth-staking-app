import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../utils/connection'
import { Contract } from '../../../models/Contract'

// Interface to defining our object of response functions
export interface ResponseFuncs {
  GET?: Function
  POST?: Function
  PUT?: Function
  DELETE?: Function
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const conn = await dbConnect() // connect to database
      // console.log('HIT GET')
      res.json(await Contract.find({}).catch(catcher))
    },
    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const conn = await dbConnect() // connect to database
      // console.log('HIT POST', req.body)
      const saveContract = await Contract.create(req.body).catch(catcher)
      // console.log(saveContract)
      res.json(saveContract)
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: 'No Response for This Request' })
}

export default handler
