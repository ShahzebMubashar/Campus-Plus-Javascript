app.use(
    cors({
        origin: [process.env.FRONTEND_URL || "https://capmus-plus-javascript.vercel.app", "http://localhost:3000"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
); 