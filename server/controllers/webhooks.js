// import { Webhook } from "svix"
// import User from "../models/User.js"
// import Stripe from "stripe"
// import { Purchase } from "../models/Purchase.js"
// import Course from "../models/Course.js"

// export const clerkWebhooks = async (req, res) => {
//   try { 

//     const payload = req.body
//     const headers = {
//       'svix-id': req.headers['svix-id'],
//       'svix-timestamp': req.headers['svix-timestamp'],
//       'svix-signature': req.headers['svix-signature'],
//     }
 

//     const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
//     const event = wh.verify(payload, headers)
 

//     const { data, type } = event 

//      switch (type) {
//         case 'user.created': {
//             const userData = {
//                 _id: data.id,
//                 email: data.email_addresses[0].email_address,
//                 name: data.first_name + ' ' + data.last_name,
//                 imageUrl: data.image_url,
//             }
//             await User.create(userData)
//             res.json({})
//             break;
//         } 

//         case 'user.updated': {
//             const userData = {
//                 email: data.email_address[0].email_address,
//                 name: data.first_name + " " + data.last_name,
//                 imageUrl: data.image_url,
//             }
//             await User.findByIdAndUpdate(data.id, userData)
//             res.json({})
//             break;
//         }

//         case 'user.deleted': {
//             await User.findByIdAndDelete(data.id)
//             res.json({})
//             break;
//         }
    
//         default:
//             break;
//     }


//     res.status(200).json({ success: true })
//   } catch (error) {
//     console.error("Webhook error:", error.message)
//     res.status(400).json({ success: false, error: error.message })
//   }
// }

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

// export const stripeWebhooks = async(request, response)=>{
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   }
//   catch (err) {
//     return response.status(400).send(`Webhook Error: ${err.message}`);
//   }
  
//   // Handle the event
//   switch (event.type) {
//     // case 'payment_intent.succeeded': {
//     //   const paymentIntent = event.data.object; 
//     //   const paymentIntentId = paymentIntent.id;

//     //   const session = await stripeInstance.checkout.sessions.list({
//     //     payment_intent: paymentIntentId
//     //   })

//     //   const { purchaseId } = session.data[0].metadata;

//     //   const purchaseData = await Purchase.findById(purchaseId)
//     //   const userData = await User.findById(purchaseData.userId)
//     //   const courseData = await Course.findById(purchaseData.courseId.toString())

//     //   courseData.enrolledStudents.push(courseData)
//     //   await courseData.save()

//     //   userData.enrolledCourses.push(courseData._id)
//     //   await userData.save()

//     //   purchaseData.status = 'completed'
//     //   await purchaseData.save()

//     //   break;
//     // }
//     case 'checkout.session.completed': {
//       const session = event.data.object

//       // Get the purchaseId you passed as metadata during session creation
//       const purchaseId = session.metadata.purchaseId

//       if (!purchaseId) {
//         return response.status(400).json({ message: "purchaseId missing in metadata" })
//       }

//       // Update Purchase status
//       const purchaseData = await Purchase.findById(purchaseId)
//       if (!purchaseData) {
//         return response.status(404).json({ message: "Purchase not found" })
//       }

//       const userData = await User.findById(purchaseData.userId)
//       const courseData = await Course.findById(purchaseData.courseId)

//       if (!userData || !courseData) {
//         return response.status(404).json({ message: "User or Course not found" })
//       }

//       // Enroll the user
//       courseData.enrolledStudents.push(userData._id)
//       await courseData.save()

//       userData.enrolledCourses.push(courseData._id)
//       await userData.save()

//       purchaseData.status = 'completed'
//       await purchaseData.save()

//       break
//     }

//     case 'payment_intent.payment_failed': {
//       const paymentIntent = event.data.object; 
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId
//       })

//       const { purchaseId } = session.data[0].metadata;
//       const purchaseData = await Purchase.findById(purchaseId)
//       purchaseData.status = 'failed'
//       await purchaseData.save()
//       break;
//     }
    
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({received: true});

// }


import { Webhook } from "svix";
import Stripe from "stripe";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// Clerk Webhook
export const clerkWebhooks = async (req, res) => {
  try {
    console.log("🔔 Clerk webhook received");

    const payload = req.body;
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const event = wh.verify(payload, headers);

    const { data, type } = event;
    console.log(`📦 Clerk Event Type: ${type}`);

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + ' ' + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        console.log("✅ User created:", userData);
        res.json({});
        break;
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + ' ' + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        console.log("🔁 User updated:", userData);
        res.json({});
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted:", data.id);
        res.json({});
        break;
      }

      default:
        console.log("⚠️ Unknown Clerk event:", type);
        res.json({});
    }
  } catch (error) {
    console.error("❌ Clerk Webhook error:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  console.log("🔔 Stripe webhook received");

  let event;
  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📦 Stripe Event Type: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const purchaseId = session.metadata.purchaseId;

      console.log("🧾 Checkout session completed:", session.id);
      console.log("🔗 purchaseId from metadata:", purchaseId);

      if (!purchaseId) {
        console.error("❌ purchaseId missing in metadata");
        return res.status(400).json({ message: "purchaseId missing in metadata" });
      }

      const purchaseData = await Purchase.findById(purchaseId);
      if (!purchaseData) {
        console.error("❌ Purchase not found:", purchaseId);
        return res.status(404).json({ message: "Purchase not found" });
      }

      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId);

      if (!userData || !courseData) {
        console.error("❌ User or Course not found", {
          userId: purchaseData.userId,
          courseId: purchaseData.courseId,
        });
        return res.status(404).json({ message: "User or Course not found" });
      }

      courseData.enrolledStudents.push(userData._id);
      await courseData.save();
      console.log("🎓 User enrolled in course:", courseData.courseTitle);

      userData.enrolledCourses.push(courseData._id);
      await userData.save();
      console.log("📘 Course added to user profile:", userData.name);

      purchaseData.status = 'completed';
      await purchaseData.save();
      console.log("✅ Purchase marked as completed:", purchaseId);

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      console.log("❌ Payment failed for intent:", paymentIntentId);

      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const session = sessionList.data[0];
      if (session?.metadata?.purchaseId) {
        const purchaseData = await Purchase.findById(session.metadata.purchaseId);
        if (purchaseData) {
          purchaseData.status = 'failed';
          await purchaseData.save();
          console.log("⚠️ Purchase marked as failed:", session.metadata.purchaseId);
        }
      }
      break;
    }

    default:
      console.log(`⚠️ Unhandled Stripe event type: ${event.type}`);
  }

  res.json({ received: true });
};
