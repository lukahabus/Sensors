import type { NextApiRequest, NextApiResponse } from "next";
import { Sensor, SensorInput } from "../../interfaces";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const validate = (req: NextApiRequest): SensorInput => {
  return {
    latitude: parseFloat((req.body.latitude as string) || ""),
    longitude: parseFloat((req.body.longitude as string) || ""),
    ip: (req.body.ip as string) || "",
    port: parseInt((req.body.port as string) || ""),
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Sensor>
) {
  const sensorInput = validate(req);

  const sensor = await prisma.sensor.create({
    data: sensorInput,
  });

  res.status(201).json(sensor);
}
