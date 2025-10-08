# Dummy Data Guide

This document explains the dummy data that has been added to demonstrate the Services and Team management features to your client.

## What Was Added

### Services (6 total)
**Residential Services:**
1. **Home Staging Consultation** - Professional home staging with 4 features
2. **Investment Property Analysis** - ROI calculations and market analysis
3. **First-Time Buyer Program** - Guidance for first-time homebuyers

**Commercial Services:**
1. **Commercial Lease Negotiation** - Expert lease negotiation services
2. **Retail Space Consulting** - Site selection and retail location analysis
3. **Office Space Planning** - Strategic office space planning

### Team Members (4 total)
1. **Sarah Mitchell** - Senior Real Estate Consultant
2. **Michael Chen** - Commercial Property Specialist
3. **Emily Rodriguez** - Investment Advisor
4. **David Thompson** - Market Analyst

All team members have:
- Professional headshot images from Unsplash
- Complete bio information
- Contact details (email, phone)
- Social media links (LinkedIn, Twitter)

## How to View Dummy Data

1. **Services Page**: Visit `http://localhost:5174/services` to see services on the public site
2. **Team Page**: Visit `http://localhost:5174/about` to see team members on the public site
3. **Admin Panel**:
   - Login at `http://localhost:5174/admin`
   - Click "Manage Services" to view/edit services
   - Click "Manage Team" to view/edit team members

## How to Delete Dummy Data

### Option 1: Via Admin Panel (Recommended)
1. Login to the admin panel at `http://localhost:5174/admin`
2. **For Services:**
   - Go to "Manage Services"
   - Click the delete button (trash icon) for each dummy service
   - Confirm deletion
3. **For Team Members:**
   - Go to "Manage Team"
   - Click the delete button (trash icon) for each dummy team member
   - Confirm deletion

### Option 2: Re-run the Seed Script
The seed script automatically clears existing dummy data before adding new data:
```bash
cd backend
npm run seed-dummy
```

### Option 3: Delete Specific Items by Name
If you want to keep some dummy data but remove specific items, use the admin panel to selectively delete only the items you don't want.

## Image Sources

All images are sourced from Unsplash (free to use):
- Services: Various professional real estate imagery
- Team Members: Professional headshots

These are external URLs, so no local image files need to be deleted.

## Demonstrating to Your Client

When showing your client how to manage content:

1. **Show them how to ADD:**
   - Click "Add New Service" or "Add Team Member"
   - Fill out the form
   - Upload an image
   - Submit

2. **Show them how to EDIT:**
   - Click the Edit button on any item
   - Modify the information
   - Optionally replace the image
   - Save changes

3. **Show them how to DELETE:**
   - Click the Delete button (trash icon)
   - Confirm the deletion
   - The item is removed immediately

## Notes

- All dummy data uses realistic content relevant to real estate consulting
- Features arrays are fully populated to demonstrate the functionality
- Social media links are example URLs (not real accounts)
- Email addresses use example.com domain
- Phone numbers use the (555) prefix (reserved for examples)

## After Client Training

Once your client is comfortable with the admin panel:
1. Have them delete all dummy services and team members
2. Have them add their real services
3. Have them add their actual team members with real photos
4. You can delete this README file if desired
