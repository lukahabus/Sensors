import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { SensorInput } from "../../interfaces";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorInput>
) {
  const id = parseInt((req.body.id as string) || "");

  const sensors = await prisma.sensor.findMany();

  const sensor = await prisma.sensor.findFirst({
    where: { id: id },
  });

  if (sensor == undefined) {
    res.status(204).json({
      latitude: 0,
      longitude: 0,
      ip: "",
      port: 0,
    });
    return;
  }

  const closest = sensors
    .filter((s) => s.id != id)
    .map((s) => {
      const dlon = sensor.longitude - s.longitude;
      const dlat = sensor.latitude - s.latitude;
      const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(sensor.latitude) *
          Math.cos(s.latitude) *
          Math.sin(dlon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = 6371 * c;

      return {
        ...s,
        distance: d,
      };
    })
    .sort((a, b) => a.distance - b.distance)[0];

  if (closest == undefined) {
    res.status(204).json(closest);
    return;
  }

  res.status(200).json(closest);
}
