Lease-n-Drive 🚗

Lease-n-Drive is a platform that simplifies vehicle leasing by offering users an easy, flexible, and hassle-free way to lease, manage, and drive cars.

Table of Contents

Features

Tech Stack

Getting Started

Usage

Folder Structure

Contributing

Contact

Features

User registration & login/authentication

Browse vehicles available for lease

Submit lease / purchase requests

Admin panel for approving/denying requests

Profile management & rating system

Responsive UI components (toasts, loading, navigation)

Approvals workflow (purchase request / lease approval)

Tech Stack
Layer	Technology
Frontend	HTML, CSS, JavaScript
Framework / Libraries	(if any) — e.g. React, Angular, Vue — update as per your stack
Backend / Salesforce	Apex controllers (LeaseAndDriveController.cls) for handling server-side logic
Configuration / Tooling	ESLint, jsconfig.json etc. for code quality & project structure
Getting Started

These steps will help you set up and run the project locally.

Clone the repository:

git clone https://github.com/yuvrajmunjal9/Lease-n-Drive.git
cd Lease-n-Drive


Install dependencies (frontend/backend as needed):

# example if using npm or yarn
npm install


Set up backend / Salesforce environment:

Deploy the LeaseAndDriveController.cls to your org

Make sure the Apex classes & triggers are properly configured

Set any required permissions, profiles, sharing settings

Run / serve the frontend:

npm start
# or your equivalent


Access the application via browser at http://localhost:3000 (or port as configured).

Usage

User flow: Register → login → browse vehicles → request lease / purchase → monitor status

Admin flow: Login as admin → view requests → approve or deny → manage vehicles & profile ratings

UI interactions: Toast notifications, loading indicators, etc., to improve feedback

Folder Structure

Here’s a rough overview of what's in the repo:

/
├── model/                    # Data models
├── profile/                  # User profile Pages / Components
├── registration/             # Registration / signup logic & components
├── purchaseRequestApproval/   # Approval pages / logic
├── rating/                   # Ratings UI & logic
├── login/                    # Login logic & pages
├── home/                     # Home page, vehicle listings
├── loading/                  # Loading spinner / loader components
├── stickyNavbar/             # Navigation component
├── toastMessage/             # Toast / popup messages
├── LeaseAndDriveController.cls # Apex backend controller
├── .eslintrc.json            # Linting config
├── jsconfig.json             # JS project configuration
└── README.md                 # Project overview (this file)

Contributing

If you’d like to contribute, here’s how:

Fork the repo

Create a new branch: git checkout -b feature/YourFeatureName

Make your changes & commit with clear messages

Push to your fork and open a Pull Request

Please make sure to:

Follow code style (lint, format)

Write clear, descriptive commit messages

Test new features or bug fixes.

Contact

Author: Yuvraj Munjal

Project GitHub: https://github.com/yuvrajmunjal9/Lease-n-Drive

Email: your.email@example.com
 (if you want to include)
