# Backend Node.js E-Commerce Project

This is the backend component of an e-commerce project built with Node.js and Express.js. It serves as the server-side logic and API for your application. The project includes various modules, each corresponding to a specific database schema, and utilizes middleware for authentication, authorization, and validation.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies by running the following command:
npm install
4. Set up any necessary environment variables by creating a `.env` file and populating it with the required values. Refer to the `.env.example` file for the required variables.
5. Start the server using the following command:
 npm start

The server should now be running on the specified port.

## Dependencies

The project relies on the following dependencies:

- Express.js: A fast and minimalist web application framework for Node.js.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- fs: A core Node.js module for handling file system operations.
- Cloudinary: A cloud-based image and video management service.
- Nodemailer: A module for sending emails from Node.js applications.
- Stripe: A popular payment processing platform, used here for PayPal payments.

Make sure to install these dependencies using `npm install` before starting the server.

## Folder Structure

The project structure is organized as follows:

├── DB
│ ├── connection.js
│ └── schemas
│ ├── User.js
│ ├── Product.js
│ ├── Order.js
│ ├── Cart.js
│ ├── Category.js
│ ├── Coupon.js
│ ├── Reviews.js
│ └── Subcategory.js
├── middleware
│ ├── authentication.js
│ ├── authorization.js
│ └── validation.js
├── modules
│ ├── user
│ │ ├── userRouter.js
│ │ ├── userController.js
│ │ ├── userValidation.js
│ │ └── userEndpoints.js
│ ├── product
│ │ ├── productRouter.js
│ │ ├── productController.js
│ │ ├── productValidation.js
│ │ └── productEndpoints.js
│ ├── order
│ │ ├── orderRouter.js
│ │ ├── orderController.js
│ │ ├── orderValidation.js
│ │ └── orderEndpoints.js
│ ├── cart
│ │ ├── cartRouter.js
│ │ ├── cartController.js
│ │ ├── cartValidation.js
│ │ └── cartEndpoints.js
│ ├── category
│ │ ├── categoryRouter.js
│ │ ├── categoryController.js
│ │ ├── categoryValidation.js
│ │ └── categoryEndpoints.js
│ ├── coupon
│ │ ├── couponRouter.js
│ │ ├── couponController.js
│ │ ├── couponValidation.js
│ │ └── couponEndpoints.js
│ ├── reviews
│ │ ├── reviewsRouter.js
│ │ ├── reviewsController.js
│ │ ├── reviewsValidation.js
│ │ └── reviewsEndpoints.js
│ └── subcategory
│ ├── subcategoryRouter.js
│ ├── subcategoryController.js
│ ├── subcategoryValidation.js
│ └── subcategoryEndpoints.js
├── app.js
└── README.md

- The `DB` folder contains the database-related files. The `connection.js` file establishes the connection to your database, and the `schemas` folder holds individual schema files for each database entity, such as `User.js`, `Product.js`, `Order.js`, `Cart.js`, `Category.js`, `Coupon.js`, `Reviews.js`, and `Subcategory.js`.

- The `middleware` folder includes files for authentication, authorization, and validation. The `authentication.js` file handles user authentication, the `authorization.js` file handles user authorization, and the `validation.js` file contains validation functions for data input.

- The `modules` folder contains subfolders for each database schema, including `user`, `product`, `order`, `cart`, `category`, `coupon`, `reviews`, and `subcategory`. Each subfolder includes router, controller, validation, and endpoints files. For example, the `user` folder includes `userRouter.js` for routing user-related requests, `userController.js` for handling user-related logic, `userValidation.js` for validating user input using Joi, and `userEndpoints.js` for defining API endpoints related to users.

- The `app.js` file is the entry point for your application and is responsible for setting up the server and configuring middleware.

Feel free to modify the folder structure or add additional files as per your project's requirements.

Author
Shaimaa Elsayed




