type Sensor = {
  id: number;
  latitude: number;
  longitude: number;
  ip: string;
  port: number;
};

type SensorInput = Omit<Sensor, "id">;

type Reading = {
  id: number;
  temperature: number | null;
  pressure: number | null;
  humidity: number | null;
  co: number | null;
  no2: number | null;
  so2: number | null;
};

type ReadingInput = Omit<Reading, "id">;

export type { Sensor, SensorInput, Reading, ReadingInput };
