import { Request, Response } from "express";
import mongoose from "mongoose";  

import { Yup, orderValidation } from "@/utils/schemaValidation";
import { IPaginationQuery, IReqUser, IReqProduct } from "@/utils/interfaces";
import User from "@/models/users.model";
import Order from "@/models/orders.model";
import Product from "@/models/products.model";

export default {
  async create(req: Request, res: Response) {
    const createdBy = (req as IReqUser).user.id;
    const { orderItems, status } = req.body

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      let grandTotal: number = 0;
      const orderItemsArray: { productId: string; quantity: number }[] = [];
      
      for (const item of orderItems) {
        const product = await Product.findById(item.productId).session(session);
        if (product) {
          if(item.quantity > product.quantity) {
            await session.abortTransaction();
            await session.endSession();

            return res.status(400).json({
              message: "Failed add order items",
              detail: `Item quantity cannot exceed current product quantity, current ${product.name} quantity : ${product.quantity}`,
            });
          }

          const orderItem: IReqProduct['product'] = {
            name: product?.name,
            productId: product?._id.toString(),
            price: product?.price,
            quantity: item.quantity,
          };
          
          product.quantity -= item.quantity;
          await product.save({ session });

          grandTotal += orderItem.price * orderItem.quantity;
          orderItemsArray.push(orderItem);
        }
      }

      const validatedOrder = await orderValidation.validate({
        grandTotal: grandTotal,
        createdBy: createdBy,
        orderItems: orderItemsArray,
        status: status,
      });

      const newOrder = await Order.create([validatedOrder], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: "Success create order",
        data: newOrder,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({
          data: error.errors,
          message: "Failed create product",
        });
        return;
      }

      const err = error as Error;

      res.status(500).json({
        message: "Failed create product",
        detail: err.message,
      });
    }
  },
  async findAllUserOrder(req: Request, res: Response) {
    const userId = (req as IReqUser).user.id;

    const user = await User.findById(userId);

    try {
      const {
        limit = 10,
        page = 1,
      } = req.query as unknown as IPaginationQuery;

      const orders = await Order.find({ createdBy: userId })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })

      const total = orders.length;

      res.status(200).json({
        message: "Success get user order histroy",
        page: +page,
        limit: +limit,
        total,
        totalPages: Math.ceil(total / limit),
        user: user,
        orders: orders,
      });
    } catch (error) {
      const err = error as Error;

      res.status(500).json({
        message: "Failed get user order histroy",
        detail: err.message,
      });
    }
  },
  async findOne(req: Request, res: Response) {
    const createdBy = (req as IReqUser).user.id;

    try {
      const order = await Product.findOne({
        _id: req.params.id,
        createdBy: createdBy,
      });

      if (!order) {
        return res.status(404).json({
          message: "Failed get order by id",
          detail: "Order not found with the given id",
        });
      }

      res.status(200).json({
        message: "Success get order by id",
        data: order,
      });
    } catch (error) {
      const err = error as Error;

      res.status(500).json({
        message: "Failed get order by id",
        data: err.message,
      });
    }
  },
  async update(req: Request, res: Response) {
    const createdBy = (req as IReqUser).user.id;
    const { orderItems, status } = req.body

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findOne({
        _id: req.params.id,
        createdBy: createdBy,
      }).session(session);

      if (!order) {
        return res.status(404).json({
          message: "Failed get order by id",
          detail: "Order not found with the given id",
        });
      }

      if (order.status !== "pending") {
        return res.status(400).json({
          message: "Failed update order",
          detail: "Order with status \"completed\" or \"cancelled\" cannot be edited",
        });
      }

      let grandTotal: number = 0;
      const orderItemsArray: { productId: string; quantity: number }[] = [];
      
      for (const item of order.orderItems) {
        const productBeforeUpdate = await Product.findByIdAndUpdate(
          { _id: item.productId },
          {
            $inc: { quantity: item.quantity }
          },
          {
            new: true,
            session: session,
          }
        );
      }
      
      for (const item of orderItems) {
        const product = await Product.findById(item.productId).session(session);
        if (product) {          
          if(item.quantity > product.quantity) {
            await session.abortTransaction();
            await session.endSession();

            return res.status(400).json({
              message: "Failed add order items",
              detail: `Item quantity cannot exceed current product quantity, current ${product.name} quantity : ${product.quantity}`,
            });
          }

          const orderItem: IReqProduct['product'] = {
            name: product?.name,
            productId: product?._id.toString(),
            price: product?.price,
            quantity: item.quantity,
          };
          
          if (status !== "cancelled" || !status) {
            const updatedProduct = await Product.findByIdAndUpdate(
              { _id: item.productId },
              {
                $inc: { quantity: -item.quantity }
              },
              {
                new: true,
              }
            ).session(session);
          }

          grandTotal += orderItem.price * orderItem.quantity;
          orderItemsArray.push(orderItem);
        }
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: req.params.id },
        {
          grandTotal: grandTotal !== 0 ? grandTotal : order.grandTotal,
          createdBy: order.createdBy,
          orderItems: orderItemsArray.length !== 0 ? orderItemsArray : order.orderItems,
          status: status ?? order.status,
        },
        {
          new: true,
        }
      ).session(session);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Success update order",
        data: updatedOrder,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      const err = error as Error;

      res.status(500).json({
        message: "Failed update order",
        data: err.message,
      });
    }
  },
  async delete(req: Request, res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Failed delete order",
          detail: "Product not found with the given id",
        });
      }

      if (order.status !== "completed") {
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(
            { _id: item.productId },
            {
              $inc: { quantity: item.quantity }
            },
            {
              new: true,
            }
          ).session(session);
        }
      }

      await Order.deleteOne({ _id: req.params.id }).session(session);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Success delete product",
        data: order,
      });
    } catch (error) {
      const err = error as Error;

      res.status(500).json({
        message: "Failed delete product",
        data: err.message,
      });
    }
  },
};
