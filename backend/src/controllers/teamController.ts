import { Request, Response } from 'express';
import TeamMember from '../models/TeamMember';

export const getAllTeamMembers = async (req: Request, res: Response) => {
  try {
    const teamMembers = await TeamMember.find().sort({ order: 1, name: 1 });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members', error });
  }
};

export const getTeamMemberById = async (req: Request, res: Response) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team member', error });
  }
};

export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const { name, role, bio, email, phone, socialLinks, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Team member image is required' });
    }

    const teamMemberData: any = {
      name,
      role,
      bio,
      image: `/uploads/${req.file.filename}`,
      email,
      phone,
      order: order || 0,
    };

    // Handle social links if provided
    if (socialLinks) {
      teamMemberData.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    }

    const teamMember = new TeamMember(teamMemberData);
    await teamMember.save();

    console.log('✅ Team member created:', teamMember.name);
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('❌ Error creating team member:', error);
    res.status(400).json({ message: 'Error creating team member', error });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, bio, email, phone, socialLinks, order } = req.body;

    const updateData: any = {
      name,
      role,
      bio,
      email,
      phone,
      order,
    };

    // Handle image upload if file provided
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Handle social links if provided
    if (socialLinks !== undefined) {
      updateData.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    }

    const teamMember = await TeamMember.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    console.log('✅ Team member updated:', teamMember.name);
    res.json(teamMember);
  } catch (error) {
    console.error('❌ Error updating team member:', error);
    res.status(400).json({ message: 'Error updating team member', error });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findByIdAndDelete(id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    console.log('✅ Team member deleted:', teamMember.name);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting team member:', error);
    res.status(500).json({ message: 'Error deleting team member', error });
  }
};
