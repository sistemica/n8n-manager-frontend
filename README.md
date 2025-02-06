# PocketBase App Template

A modern, production-ready application template for building SaaS applications with PocketBase. This template provides a complete user management system and template pages to kickstart your application development.

## Features

- 🔐 Complete user authentication system
- 👥 User management with email verification
- 🎨 Beautiful, responsive UI with dark/light mode
- 🌍 Internationalization (English & German)
- 📱 Mobile-friendly design
- ⚡ Built with modern technologies:
  - React + TypeScript
  - Tailwind CSS
  - Framer Motion
  - Lucide Icons
  - i18next

## Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or higher)
- [PocketBase](https://pocketbase.io) server

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/hannes-sistemica/pocket-app-template.git
   cd pocket-app-template
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your PocketBase server URL:
   ```
   VITE_POCKETBASE_URL=http://localhost:8090
   VITE_THEME=light  # or 'dark'
   ```

4. Start the development server:
   ```bash
   bun dev
   ```

## Project Structure

```
├── public/
│   └── fonts/          # Local font files
├── src/
│   ├── components/     # React components
│   ├── config/         # Configuration files
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Layout components
│   ├── lib/           
│   │   ├── i18n/      # Internationalization
│   │   ├── pocketbase.ts
│   │   └── theme.ts
│   ├── pages/         # Page components
│   └── services/      # API services
```

## Development

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add the route to the navigation config in `src/config/navigation.ts`
3. Update the translations in `src/lib/i18n/locales/`

### Customizing the Theme

The template uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* ... */ },
        dark: { /* ... */ }
      }
    }
  }
}
```

### Adding New Features

1. Create new components in `src/components/`
2. Add new services in `src/services/`
3. Update types as needed
4. Add translations for new features

## Production Deployment

1. Build the application:
   ```bash
   bun run build
   ```

2. Deploy the contents of the `dist` directory to your hosting provider

3. Ensure your PocketBase server is properly configured and accessible

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.