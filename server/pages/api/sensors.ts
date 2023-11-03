import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { SensorInput } from "../../interfaces";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorInput | SensorInput[] | { message: string }>
) {
  // Check if an ID is provided in the query string
  const { id } = req.query;
  console.log(id);

  try {
    // If an ID is provided, fetch the specific sensor
    if (id) {
      const sensor = await prisma.sensor.findUnique({
        where: { id: parseInt(id as string) },
      });

      // If the sensor is not found, return a 404 response
      if (!sensor) {
        return res.status(404).json({ message: 'Sensor not found.' });
      }

      // Return the sensor with a 200 status code
      return res.status(200).json(sensor);
    }

    // If no ID is provided, return all sensors
    const sensors = await prisma.sensor.findMany();
    return res.status(200).json(sensors);
  } catch (error) {
    // If an error occurs, return a 500 status code and the error message
    return res.status(500).json({ message: 'Server error.' });
  }
}
