import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const cars = await prisma.car.findMany({
      include: {
        vehicletype: true
      }
    });
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const car = await prisma.car.findUnique({
      where: { id: parseInt(String(id), 10) },
      include: {
        vehicletype: true
      }
    });

    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }

    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
