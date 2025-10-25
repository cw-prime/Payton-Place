import { Request, Response } from 'express';
import ServiceRequest from '../models/ServiceRequest';
import { sendServiceRequestNotification, verifyTurnstileToken } from '../services/emailService';

export const getAllServiceRequests = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = {};

    if (status) filter.status = status;

    const requests = await ServiceRequest.find(filter)
      .populate('serviceId', 'name category')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service requests', error });
  }
};

export const getServiceRequestById = async (req: Request, res: Response) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('serviceId', 'name category description');
    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service request', error });
  }
};

export const createServiceRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, serviceId, message, preferredContactMethod, turnstileToken } = req.body;

    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      return res.status(400).json({ message: 'Bot verification failed. Please try again.' });
    }

    const serviceRequest = new ServiceRequest({
      name,
      email,
      phone,
      serviceId,
      message,
      preferredContactMethod: preferredContactMethod || 'either',
    });

    await serviceRequest.save();

    console.log('✅ Service request created:', serviceRequest.name);

    // Send email notification (populate serviceId for email template)
    try {
      const populatedRequest = await ServiceRequest.findById(serviceRequest._id)
        .populate('serviceId', 'name category');

      if (populatedRequest) {
        await sendServiceRequestNotification(populatedRequest as any);
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('⚠️ Email notification failed, but request was saved:', emailError);
    }

    res.status(201).json(serviceRequest);
  } catch (error) {
    console.error('❌ Error creating service request:', error);
    res.status(400).json({ message: 'Error creating service request', error });
  }
};

export const updateServiceRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('serviceId', 'name category');

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    console.log('✅ Service request status updated:', serviceRequest._id);
    res.json(serviceRequest);
  } catch (error) {
    console.error('❌ Error updating service request:', error);
    res.status(400).json({ message: 'Error updating service request', error });
  }
};

export const deleteServiceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceRequest = await ServiceRequest.findByIdAndDelete(id);

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    console.log('✅ Service request deleted:', serviceRequest._id);
    res.json({ message: 'Service request deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting service request:', error);
    res.status(500).json({ message: 'Error deleting service request', error });
  }
};
