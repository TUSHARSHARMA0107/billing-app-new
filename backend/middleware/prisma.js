import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default (req, res, next) => {
  req.prisma = prisma;
  next();
};