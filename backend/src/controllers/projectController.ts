import { Request, Response } from 'express';
import Project from '../models/Project';

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { category, featured } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const projectData = { ...req.body };

    // Handle uploaded images
    if (req.files && Array.isArray(req.files)) {
      const imageUrls = req.files.map((file: Express.Multer.File) => {
        // In development, use local path
        // In production with Cloudinary, this would be the Cloudinary URL
        return `/uploads/${file.filename}`;
      });
      projectData.images = imageUrls;
    }

    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project', error });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    console.log('🔍 req.body keys:', Object.keys(req.body));
    console.log('🔍 req.body:', req.body);

    // Start with existing images from request (these are the ones NOT marked for deletion)
    let finalImages: string[] = [];

    // Get existing images that should be kept (sent from frontend)
    // FormData might send it as 'existingImages[]' or 'existingImages'
    const existingImagesParam = req.body['existingImages[]'] || req.body['existingImages'];

    if (existingImagesParam) {
      finalImages = Array.isArray(existingImagesParam) ? existingImagesParam : [existingImagesParam];
      console.log('📷 Keeping existing images:', finalImages);
    } else {
      console.log('⚠️ No existing images found in req.body');
    }

    // Add newly uploaded images
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImageUrls = req.files.map((file: Express.Multer.File) => `/uploads/${file.filename}`);
      console.log('📸 New images uploaded:', newImageUrls);
      finalImages = [...finalImages, ...newImageUrls];
    }

    // Update the images array
    updateData.images = finalImages;
    console.log('📷 Final images array:', finalImages);

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('✅ Project updated with images:', project.images);
    res.json(project);
  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(400).json({ message: 'Error updating project', error });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
};
