# Campus Plus Javascript

A modern, full-stack campus management platform built with React and Node.js.

---

## 🚀 Getting Started

### 1. **Clone the repository**

```bash
 git clone https://github.com/yourusername/Campus-Plus-Javascript.git
 cd Campus-Plus-Javascript
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Environment Variables**

- Copy `.env.example` to `.env` in the backend directory and fill in your secrets:
  - Database credentials
  - Email credentials
  - Session secret
  - Client origin

### 4. **Run the app**

- **Frontend:**
  ```bash
  npm start
  ```
- **Backend:**
  ```bash
  cd backend
  node src/Server.js
  ```

---

## 🛡️ Security & Best Practices

- All backend routes use `express-validator` for input validation.
- Security middleware: `helmet`, `express-rate-limit`, `cors`, `morgan`.
- Centralized error handler (no stack traces in production).
- All secrets/configs are loaded from environment variables.
- All forms use Formik + Yup for robust frontend validation and user feedback.
- No unsafe use of `dangerouslySetInnerHTML` in frontend.

---

## 🧪 Testing

- **Frontend:** Uses Jest and React Testing Library.
  - Run tests: `npm test`
- **Backend:** Add tests in `backend/tests/` and run with Jest or Mocha.

---

## 🧹 Linting & Formatting

- Uses ESLint and Prettier for code style and consistency.
- To lint: `npx eslint .`
- To format: `npx prettier --write .`

---

## 🔒 Dependency Audit

- Check for vulnerabilities: `npm audit`
- Fix automatically: `npm audit fix`

---

## 🤝 Contributing

1. Fork the repo and create your branch from `main`.
2. Run lint and tests before submitting a PR.
3. Add/Update documentation as needed.
4. Use clear, descriptive commit messages.

---

## 📄 License

[MIT](LICENSE)

---

## 📢 Contact

For support, open an issue or contact the maintainers.
