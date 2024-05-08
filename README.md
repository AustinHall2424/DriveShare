# DriveShare

DriveShare is a peer-to-peer rental platform that enables users to rent vehicles from others within their community. This full-stack web application utilizes React for the frontend and Firebase for the backend. It features robust user authentication, allowing users to securely create accounts, log in, and manage their rental transactions. Additionally, DriveShare incorporates a messaging system to facilitate communication between renters and vehicle owners.

## Features

- **User Authentication**: DriveShare provides secure user authentication, allowing individuals to create accounts, log in, and manage their profiles.
  
- **Vehicle Listings**: Users can list their vehicles for rent on the platform, providing details such as vehicle type, availability, and rental pricing.
  
- **Search and Filter**: DriveShare offers search and filter functionalities, enabling users to find available vehicles based on criteria such as location, vehicle type, and rental dates.
  
- **Booking and Payments**: Renters can easily book vehicles through the platform and make secure payments. Vehicle owners receive notifications of bookings and can manage their rental schedules.
  
- **Messaging System**: DriveShare includes a messaging system that facilitates communication between renters and vehicle owners. Users can discuss rental details, coordinate pickup and drop-off locations, and address any inquiries or concerns.

## Technologies Used

- **Frontend**: React.js, React Router, Material-UI
  
- **Backend**: Firebase Authentication, Firestore Database, Firebase Cloud Functions
  
- **Messaging**: Firebase Realtime Database
  
- **Deployment**: Firebase Hosting

## Getting Started

To run DriveShare locally or deploy it to your own Firebase project, follow these steps:

1. Clone this repository to your local machine.
  
2. Navigate to the `frontend` directory and run `npm install` to install frontend dependencies.
  
3. Set up a Firebase project and configure Firebase Authentication, Firestore Database, and Firebase Cloud Messaging.
  
4. Replace the Firebase configuration in `src/firebase.js` with your own Firebase project credentials.
  
5. Run `npm start` to start the frontend server locally.
