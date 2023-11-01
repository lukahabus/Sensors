import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Reading, ReadingInput } from "../../interfaces";

const prisma = new PrismaClient();

const validate = (req: NextApiRequest): ReadingInput => {
  return {
    temperature: parseFloat((req.body.temperature as string) || ""),
    pressure: parseFloat((req.body.pressure as string) || ""),
    humidity: parseFloat((req.body.humidity as string) || ""),
    co: parseFloat((req.body.co as string) || ""),
    no2: parseFloat((req.body.no2 as string) || ""),
    so2: parseFloat((req.body.so2 as string) || ""),
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reading>
) {
  const readingInput = validate(req);
  const sensorId = parseInt((req.body.sensorId as string) || "");

  const sensor = await prisma.sensor.findFirst({
    where: { id: sensorId },
  });

  if (sensor == undefined) {
    res.status(204).json({
      id: 0,
      temperature: null,
      pressure: null,
      humidity: null,
      co: null,
      no2: null,
      so2: null,
    });
    return;
  }

  const reading = await prisma.reading.create({
    data: {
      ...readingInput,
      sensorId: parseInt((req.body.sensorId as string) || ""),
    },
  });

  res.status(201).json(reading);
}
