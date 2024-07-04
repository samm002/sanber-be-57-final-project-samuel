import mongoose from "mongoose";

import User from "@/models/users.model";
import mail from "@/utils/mail";

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    grandTotal: {
      type: Number,
      required: true,
    },
    orderItems: [{
      name: {
        type: String,
        required: true,
      },
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less than 1"],
        max: [5, "Quantity can not be more than 5"],
      },
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.post("save", async function (doc, next) {
  const order = doc;
  const user = await User.findById(order.createdBy);

  if (!user) {
    console.error("User not found for order:", order._id);
    next(new Error("User not found for the order"));
    return;
  }

  const content = await mail.render("orderInvoice.ejs", {
    customerName: user.fullName,
    orderItems: order.orderItems,
    grandTotal: order.grandTotal,
    contactEmail: process.env.MAIL_USER,
    companyName: "Toko Typescript",
    year: new Date().getFullYear(),
  });

  await mail.send({
    to: user.email,
    subject: "Toko Typescript Order Invoice",
    content: content,
  });

  next();
});

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
