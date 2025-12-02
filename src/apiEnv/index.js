export const API =
    process.env.NODE_ENV === "production"
        ? 'https://agrisensebackend.innovationghar.com/api'
        : 'http://localhost:8000/api';

export const API_SERVER =
    process.env.NODE_ENV === "production"
        ? process.env.NEXT_API_SERVER_URL
        : process.env.NEXT_API_URL;