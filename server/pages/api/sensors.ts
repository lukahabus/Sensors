import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { SensorInput } from "../../interfaces";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorInput[]>
) {
  const sensors = await prisma.sensor.findMany();

  res.status(200).json(sensors);
}
