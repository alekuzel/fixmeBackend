# Befintliga endpoints kring admin funktionalitet


1. **Register Admin**
   - **Method**: POST
   - **Endpoint**: `/admins/register`
   - **Description**: Registers a new admin with email confirmation.
   - **Request Body**:
     - `firstName`: First name of the admin.
     - `lastName`: Last name of the admin.
     - `password`: Password for the admin.
     - `email`: Email address of the admin.
   - **Response**:
     - Success:
       - Status Code: 201
       - Body: `{ "message": "Admin created successfully. Confirmation email sent." }`
     - Failure:
       - Status Code: 400
       - Body: `{ "error": "Error message" }`

2. **Fetch Support Admins**
   - **Method**: GET
   - **Endpoint**: `/admins/support`
   - **Description**: Fetches all admins with the role "support".
   - **Response**:
     - Success:
       - Status Code: 200
       - Body: Array of support admins.
     - Failure:
       - Status Code: 500
       - Body: `{ "error": "Error message" }`

3. **Fetch Regular Admins**
   - **Method**: GET
   - **Endpoint**: `/admins/admins`
   - **Description**: Fetches all admins with the role "admin".
   - **Response**:
     - Success:
       - Status Code: 200
       - Body: Array of regular admins.
     - Failure:
       - Status Code: 500
       - Body: `{ "error": "Error message" }`

4. **Confirm Admin Registration**
   - **Method**: POST
   - **Endpoint**: `/admins/confirm-registration`
   - **Description**: Confirms registration of an admin.
   - **Request Body**:
     - `token`: Confirmation token received via email.
   - **Response**:
     - Success:
       - Status Code: 200
       - Body: `{ "message": "Registration confirmed successfully" }`
     - Failure:
       - Status Code: 400
       - Body: `{ "error": "Error message" }`

5. **Fetch All Admins with any role**
   - **Method**: GET
   - **Endpoint**: `/admins`
   - **Description**: Fetches all admins.
   - **Response**:
     - Success:
       - Status Code: 200
       - Body: Array of all admins.
     - Failure:
       - Status Code: 500
       - Body: `{ "error": "Error message" }`

6. **Get Admin by ID**
   - **Method**: GET
   - **Endpoint**: `/admins/:id`
   - **Description**: Fetches an admin by ID.
   - **Parameters**:
     - `id`: Admin ID.
   - **Response**:
     - Success:
       - Status Code: 200
       - Body: Admin object.
     - Failure:
       - Status Code: 404
       - Body: `{ "message": "Error message" }`

7. **Update Admin by ID**
   - **Method**: PUT
   - **Endpoint**: `/admins/:id`
   - **Description**: Updates an admin by ID.
   - **Parameters**:
     - `id`: Admin ID.
   - **Request Body**: Updated admin data.
   - **Response**:
     - Success:
       - Status Code: 200
       - Body: Updated admin object.
     - Failure:
       - Status Code: 400
       - Body: `{ "error": "Error message" }`

8. **Delete Admin by ID**
   - **Method**: DELETE
   - **Endpoint**: `/admins/:id`
   - **Description**: Deletes an admin by ID.
   - **Parameters**:
     - `id`: Admin ID.
   - **Response**:
     - Success:
       - Status Code: 200
       - Body: `{ "message": "Admin deleted successfully" }`
     - Failure:
       - Status Code: 500
       - Body: `{ "error": "Error message" }`

9. **Upload Admin Image**
   - **Method**: POST
   - **Endpoint**: `/admins/:id/upload`
   - **Description**: Uploads an image for a specific admin.
   - **Parameters**:
     - `id`: Admin ID.
     - `image`: Image file to upload.
   - **Request Body**: Form data with a single file field named `image`.
   - **Response**:
     - Success:
       - Status Code: 200
       - Body: `{ "message": "Image uploaded successfully" }`
     - Failure:
       - Status Code: 500
       - Body: `{ "message": "Error message" }`

10. **Admin Login**
    - **Method**: POST
    - **Endpoint**: `/admin/login`
    - **Description**: Authenticates an admin based on provided credentials.
    - **Request Body**:
      - `email`: Email address of the admin.
      - `password`: Password of the admin.
    - **Response**:
      - Success:
        - Status Code: 200
        - Body: `{ "message": "Authentication successful", "admin": { /* Admin object */ } }`
      - Failure:
        - Status Code: 401
        - Body: `{ "message": "Invalid username or password" }`
        - Status Code: 500
        - Body: `{ "message": "An error occurred" }`


# Möjliga endpoints kring users funktionalitet


1. **User Authentication**
   - `POST /api/auth/login`: User login.

2. **User Registration and Confirmation**
   - `POST /api/auth/register`: Register a new user account.
   - `POST /api/auth/confirm-registration`: Confirm user registration.

3. **Search Hairdressers**
   - `GET /api/hairdressers`: Retrieve a list of hairdressers.
   - `GET /api/hairdressers/search`: Search for hairdressers based on criteria.

4. **Mixed View of Services and Hairdressers**
   - No specific endpoint needed; frontend can combine data from `/api/hairdressers` and `/api/services` to display a mixed view.

5. **Service Page for Hairdressers**
   - `GET /api/hairdressers/:id`: Retrieve detailed information about a specific hairdresser.

6. **Payment System for Hairdresser Services**
   - `POST /api/bookings`: Book a service with a hairdresser.

7. **Purchase History Page**
    - `GET /api/bookings/user/:userId`: Retrieve booking history for a specific user.

8. **Leave Reviews and Feedback**
    - `POST /api/reviews`: Submit a review for a hairdresser. Possibly endppoint for editing and deleting reviews as well.

9. **Prediction and Pre-booking**
    - `GET /api/suggested-bookings`: Get suggestions for the next booking based on user's history.
