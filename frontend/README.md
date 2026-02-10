# Jerry's Chaska - Frontend

A professional food ordering system frontend built with React, Vite, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  Navigate to the project directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

The app will run at `http://localhost:5173`.

## 🐳 Docker Setup

To build and run the application using Docker:

1.  Build the image:
    ```bash
    docker build -t jerrys-chaska-frontend .
    ```

2.  Run the container:
    ```bash
    docker run -p 3000:80 jerrys-chaska-frontend
    ```

The app will be accessible at `http://localhost:3000`.

## 🛠 Tech Stack

-   **React.js (Vite)**: Fast frontend tooling.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **React Router**: Client-side routing.
-   **Axios**: HTTP client (Mocked for now).
-   **Lucide React**: Icons.

## 📧 Contact Form Setup (EmailJS)

To enable real email sending from the Contact page:

1.  **Create Account**: Sign up for free at [EmailJS](https://www.emailjs.com/).
2.  **Add Service**: Go to "Email Services" and connect your provider (e.g., Gmail). Note the **Service ID**.
3.  **Create Template**: Go to "Email Templates" and create a new one.
    - Use variables: `{{from_name}}`, `{{from_email}}`, `{{message}}`.
    - Set "To Email" to `jenishchauhan.08@gmail.com`.
    - Note the **Template ID**.
4.  **Get Public Key**: Go to "Account" -> "API Keys" to find your **Public Key**.
5.  **Configure `.env`**: Create or update the `frontend/.env` file:
    ```env
    VITE_EMAILJS_SERVICE_ID=your_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_public_key
    ```
6.  **Test Locally**:
    - Run `npm run dev` in the `frontend` folder.
    - Navigate to `/contact`.
    - Fill the form and click "Send".
    - A success banner `bg-green-500` will appear if confirmed.

## 🎨 Production UI Features

-   **High Contrast**: All text on dark cards and panels uses explicit Tailwind classes for absolute readability (`text-white`, `text-orange-400`, `text-gray-200`, `text-gray-300`).
-   **Dark Theme**: Core interactive elements (Menu cards, Cart items, Order Summary) feature a professional dark theme (`bg-secondary`).
-   **Dynamic Ratings**: Users can rate items directly from the Menu page, with results persisted in `localStorage`.
-   **Real Navigation**: Navbar and Footer links are fully functional, routing to About, Contact, and Privacy pages.

## 🔗 Backend Integration

Currently, the application uses a mock API service located in `src/services/api.js`.

To connect to a real backend:
1.  Create a `.env` file in the root directory.
2.  Set the API URL: `VITE_API_URL=http://your-backend-api.com`
3.  Update `src/services/api.js` to remove mock delays and return actual Axios responses.

## 📂 Folder Structure

-   `src/components`: Reusable UI components.
-   `src/pages`: Application pages (Landing, Menu, Cart, etc.).
-   `src/context`: React Context for state management (Auth, Cart).
-   `src/services`: API service and mock data.
-   `src/layout`: Layout components (Navbar, Footer).
