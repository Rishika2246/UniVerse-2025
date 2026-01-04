# QR Codes for Hall Tickets

This folder contains QR code images used in the student hall ticket system.

## Files:
- `hall-ticket-qr.svg` - Main QR code template for hall tickets
- `student-qr-001.svg` - QR code for student 001
- `student-qr-002.svg` - QR code for student 002
- `sample-qr.svg` - Sample QR code for testing

## Usage:
These QR codes are displayed in the student hall ticket interface and can be:
1. Viewed in a popup modal when clicking "Show QR Code"
2. Downloaded individually when clicking "Download QR Code"
3. Included in the full hall ticket PDF download

## Format:
All QR codes are in SVG format for scalability and quality.

## Integration:
The QR codes are integrated into the ExamsCenter component and displayed in:
- Hall ticket preview (small version)
- QR code popup modal (large version)
- Downloaded as separate files

## Security:
Each QR code should contain unique student information including:
- Student ID
- Roll Number
- Hall Ticket Number
- Exam Session
- Timestamp