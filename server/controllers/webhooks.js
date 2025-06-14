// import { Webhook } from "svix";
// import User from "../models/User.js"; 

// //API controller function to manage clerk user with database

// export const clerkWebhooks = async (req, res)=>{
//     try {
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//         await whook.verify(JSON.stringify(req.body), {
//             'svix-id': req.headers['svix-id'],
//             'svix-timestamp': req.headers['svix-timestamp'],
//             'svix-timestamp': req.headers['svix-signature']
//         })

//         const {data, type} = req.body

//         switch (type) {
//             case 'user.created': {
//                 const userData = {
//                     _id: data.id,
//                     email: data.email_addresses[0].email_address,
//                     name: data.first_name + ' ' + data.last_name,
//                     imageUrl: data.image_url,
//                 }
//                 await User.create(userData)
//                 res.json({})
//                 break;
//             } 

//             case 'user.updated': {
//                 const userData = {
//                     email: data.email_address[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     imageUrl: data.image_url,
//                 }
//                 await User.findByIdAndUpdate(data.id, userData)
//                 res.json({})
//                 break;
//             }

//             case 'user.deleted': {
//                 await User.findByIdAndDelete(data.id)
//                 res.json({})
//                 break;
//             }
        
//             default:
//                 break;
//         }

//     } catch (error) {
//         res.json({success: false, message: error.message})
//     }
// }

import { Webhook } from 'svix'
import User from '../models/User.js'

export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body // raw buffer
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    const event = wh.verify(payload, headers)

    const { data, type } = event

    console.log('Webhook Event:', type)

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        }
        await User.create(userData)
        break
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        break
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        break
      }

      default:
        break
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Webhook Error:', error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}
