To create a MERN (MongoDB, Express.js, React, Node.js) assignment with the features you
described, the following functionalities should be implemented:
Features:
1. User Authentication:
o Login: Secure login with validations.
o Registration: New users can sign up with validation and data stored in
MongoDB.
o Password hashing (e.g., using bcrypt).
o Token-based authentication (e.g., using JWT).
2. Image Boundary Detection and Editing:
o Allow users to upload images.
o Detect boundaries of objects in the image using a library like OpenCV or
TensorFlow.js.
o Provide tools to edit these boundaries (e.g., resizing, moving, or deleting
boundaries).

Assignment Structure:
1. Backend (Node.js + Express.js):
o User authentication endpoints: /login, /register.
o Image upload endpoint: /upload.
o Boundary detection logic (e.g., with OpenCV or another library).
o Serve the edited boundaries back to the client.
2. Frontend (React.js):
o Login/Registration pages.
o A dashboard where users can upload images.
o Canvas-based boundary editing tools (e.g., using libraries like fabric.js or
Konva.js).
3. Database:
o MongoDB for storing user data, image metadata, and boundary data. 
