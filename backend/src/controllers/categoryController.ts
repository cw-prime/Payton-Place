import { Request, Response } from 'express';
import Category from '../models/Category';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { type, active } = req.query;
    const filter: any = {};

    if (type) filter.type = type;
    if (active !== undefined) filter.active = active === 'true';

    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, type, active } = req.body;

    const categoryData: any = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      type,
      active: active !== undefined ? active : true,
    };

    const category = new Category(categoryData);
    await category.save();

    console.log('✅ Category created:', category.name);
    res.status(201).json(category);
  } catch (error) {
    console.error('❌ Error creating category:', error);
    res.status(400).json({ message: 'Error creating category', error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, type, active } = req.body;

    const updateData: any = {
      name,
      slug,
      description,
      type,
      active,
    };

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log('✅ Category updated:', category.name);
    res.json(category);
  } catch (error) {
    console.error('❌ Error updating category:', error);
    res.status(400).json({ message: 'Error updating category', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log('✅ Category deleted:', category.name);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
