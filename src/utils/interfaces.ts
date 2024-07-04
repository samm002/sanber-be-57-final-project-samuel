import { Request } from "express";

interface IReqUser extends Request {
  user: {
    roles: string[],
    id: string,
  };
};

interface IReqProduct extends Request {
  product: {
    name: string,
    productId: string,
    price: number,
    quantity: number,
  };
};

interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
};

export {
  IReqUser,
  IReqProduct,
  IPaginationQuery,
}