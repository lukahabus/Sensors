import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { ReadingInput } from "../../interfaces";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReadingInput[]>
) {
  const sensorId = parseInt((req.body.sensorId as string) || "");

  const sensor = await prisma.sensor.findFirst({
    where: { id: sensorId },
  });

  if (sensor == undefined) {
    res.status(204).json([]);
    return;
  }

  const readings = await prisma.reading.findMany({
    where: { sensorId },
  });

  res.status(200).json(readings);
}
