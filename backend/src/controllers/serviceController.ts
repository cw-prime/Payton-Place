import { Request, Response } from 'express';
import Service from '../models/Service';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = {};

    if (category) filter.category = category;

    const services = await Service.find(filter).sort({ category: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, category, icon, features } = req.body;

    const serviceData: any = {
      name,
      description,
      category,
      icon,
    };

    // Handle image upload if file provided
    if (req.file) {
      serviceData.image = `/uploads/${req.file.filename}`;
    }

    // Handle features array
    if (features) {
      serviceData.features = Array.isArray(features) ? features : [features];
    }

    const service = new Service(serviceData);
    await service.save();

    console.log('✅ Service created:', service.name);
    res.status(201).json(service);
  } catch (error) {
    console.error('❌ Error creating service:', error);
    res.status(400).json({ message: 'Error creating service', error });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, category, icon, features } = req.body;

    const updateData: any = {
      name,
      description,
      category,
      icon,
    };

    // Handle image upload if file provided
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Handle features array
    if (features !== undefined) {
      updateData.features = Array.isArray(features) ? features : [features];
    }

    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    console.log('✅ Service updated:', service.name);
    res.json(service);
  } catch (error) {
    console.error('❌ Error updating service:', error);
    res.status(400).json({ message: 'Error updating service', error });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    console.log('✅ Service deleted:', service.name);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service', error });
  }
};
