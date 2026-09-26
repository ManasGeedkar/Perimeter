import { NotificationItem } from '../types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    title: 'Certificate Expiring in 7 Days',
    message: 'Certificate CERT-TN-2025-003310 for Koyambedu Wholesale Vegetables Market expires on 02-Oct-2026.',
    timestamp: '10 minutes ago',
    read: false,
    type: 'expiry',
    priority: 'high',
    link: '/certificates/CERT-TN-2025-003310'
  },
  {
    id: 'NOTIF-002',
    title: 'New Verification Scheduled',
    message: 'Application APP-2026-000182 for Shree Ganesh Agro Mills scheduled for field inspection today at 11:30 AM.',
    timestamp: '25 minutes ago',
    read: false,
    type: 'verification',
    priority: 'high',
    link: '/verification/APP-2026-000182'
  },
  {
    id: 'NOTIF-003',
    title: 'Special Case: Damaged Plate Application',
    message: 'Temporary application TEMP-APP-2026-000042 submitted by Awadh Hardware with identification pending.',
    timestamp: '1 hour ago',
    read: false,
    type: 'application',
    priority: 'high',
    link: '/applications/TEMP-APP-2026-000042'
  },
  {
    id: 'NOTIF-004',
    title: 'Certificate Expiring in 15 Days',
    message: 'Certificate CERT-MH-2026-001044 for Kaveri Highway Fuel Stop (HPCL) requires renewal verification before 10-Oct.',
    timestamp: '2 hours ago',
    read: false,
    type: 'expiry',
    priority: 'medium',
    link: '/certificates/CERT-MH-2026-001044'
  },
  {
    id: 'NOTIF-005',
    title: 'Officer Assignment Updated',
    message: 'LMO Rajesh Kumar assigned to 3 new periodic weighing scale verifications in Indore Circle.',
    timestamp: '3 hours ago',
    read: false,
    type: 'assignment',
    priority: 'medium',
    link: '/officers'
  },
  {
    id: 'NOTIF-006',
    title: 'Digital Certificate Generated',
    message: 'Certificate CERT-DL-2026-000199 digitally sealed and signed by Dr. Priya Sharma for Vanguard Pharma.',
    timestamp: '4 hours ago',
    read: true,
    type: 'certificate',
    priority: 'low',
    link: '/certificates/CERT-DL-2026-000199'
  },
  {
    id: 'NOTIF-007',
    title: 'Tampering Alert / Certificate Revoked',
    message: 'Certificate CERT-AP-2025-008119 for Vizag Port Coal & Minerals Yard revoked due to broken junction box seal.',
    timestamp: 'Yesterday',
    read: true,
    type: 'alert',
    priority: 'high',
    link: '/certificates/CERT-AP-2025-008119'
  },
  {
    id: 'NOTIF-008',
    title: 'Field Verification Completed',
    message: 'Verification for DS-415 POS Scale at Bhopal Supermarket passed all test load observations.',
    timestamp: 'Yesterday',
    read: true,
    type: 'verification',
    priority: 'low',
    link: '/certificates/CERT-MP-2025-006734'
  },
  {
    id: 'NOTIF-009',
    title: 'Overdue Notice Dispatched',
    message: 'Instrument KA-BLR-PS-2026-004112 marked overdue (195 days expired). Notice sent to Apex Logistics.',
    timestamp: '2 days ago',
    read: true,
    type: 'expiry',
    priority: 'high',
    link: '/instruments/KA-BLR-PS-2026-004112'
  },
  {
    id: 'NOTIF-010',
    title: 'GATC Accreditation Renewal',
    message: 'Indore Central Metrology Lab (GATC-01) successfully renewed ISO/IEC 17025 accreditation.',
    timestamp: '3 days ago',
    read: true,
    type: 'alert',
    priority: 'medium',
    link: '/officers'
  },
  {
    id: 'NOTIF-011',
    title: 'New Verification Application Submitted',
    message: 'Application APP-2026-000201 received for 100 Ton Weighbridge from Sabarmati Freight Mandi.',
    timestamp: '3 days ago',
    read: true,
    type: 'application',
    priority: 'medium',
    link: '/applications/APP-2026-000201'
  },
  {
    id: 'NOTIF-012',
    title: 'Certificate Expiring in 9 Days',
    message: 'Certificate CERT-TS-2025-004481 for Deccan Retail Petroleum Outlet expires on 04-Oct-2026.',
    timestamp: '4 days ago',
    read: true,
    type: 'expiry',
    priority: 'medium',
    link: '/certificates/CERT-TS-2025-004481'
  },
  {
    id: 'NOTIF-013',
    title: 'Verification Failed Notice',
    message: 'Scale at Kota Grain & Spice failed calibration drift test. Re-calibration order issued.',
    timestamp: '4 days ago',
    read: true,
    type: 'verification',
    priority: 'high',
    link: '/applications/APP-2026-000265'
  },
  {
    id: 'NOTIF-014',
    title: 'Monthly Verification Target Achieved',
    message: 'Indore Circle achieved 98.4% timely verification quota under Legal Metrology Act rules.',
    timestamp: '5 days ago',
    read: true,
    type: 'alert',
    priority: 'low',
    link: '/reports'
  },
  {
    id: 'NOTIF-015',
    title: 'Payment Confirmed',
    message: 'Statutory verification fee Rs. 1,200 received via Bharat BillPay for Marine Fuel Dispenser KL-013441.',
    timestamp: '5 days ago',
    read: true,
    type: 'application',
    priority: 'low',
    link: '/applications'
  },
  {
    id: 'NOTIF-016',
    title: 'Temporary Identification Linked',
    message: 'Special inspection scheduled for damaged plate instrument at Maheshwari General Store, Gwalior.',
    timestamp: '6 days ago',
    read: true,
    type: 'assignment',
    priority: 'medium',
    link: '/applications/TEMP-APP-2026-000088'
  },
  {
    id: 'NOTIF-017',
    title: 'New Inspector Assigned to Circle',
    message: 'Jignesh Trivedi has taken charge of industrial weighbridge verification for Ahmedabad East.',
    timestamp: '1 week ago',
    read: true,
    type: 'assignment',
    priority: 'low',
    link: '/officers'
  },
  {
    id: 'NOTIF-018',
    title: 'Mass Flowmeter Calibration Certified',
    message: 'Certificate issued for Yokogawa Coriolis mass flowmeter at Brahmaputra Tea Processing.',
    timestamp: '1 week ago',
    read: true,
    type: 'certificate',
    priority: 'low',
    link: '/certificates'
  },
  {
    id: 'NOTIF-019',
    title: 'Public QR Verification Hit',
    message: 'Public consumer verified certificate QR code for Shree Ganesh Agro Mills via mobile portal.',
    timestamp: '1 week ago',
    read: true,
    type: 'alert',
    priority: 'low',
    link: '/public/verify/CERT-MP-2026-000821'
  },
  {
    id: 'NOTIF-020',
    title: 'System Maintenance Scheduled',
    message: 'National Metrology Database sync window scheduled for Sunday 02:00 AM - 03:00 AM IST.',
    timestamp: '1 week ago',
    read: true,
    type: 'alert',
    priority: 'low',
    link: '/settings'
  },
  {
    id: 'NOTIF-021',
    title: 'New High-Precision Standard Weights Received',
    message: 'Class F1 certified weight set delivered to Central Metrology Lab for laboratory verification.',
    timestamp: '2 weeks ago',
    read: true,
    type: 'alert',
    priority: 'low',
    link: '/officers'
  },
  {
    id: 'NOTIF-022',
    title: 'Suspension Order Issued',
    message: 'Suspension notice served to Kota Grain Emporium under Section 15 of Legal Metrology Act.',
    timestamp: '2 weeks ago',
    read: true,
    type: 'alert',
    priority: 'high',
    link: '/instruments/RJ-KOT-WT-2026-031209'
  }
];
