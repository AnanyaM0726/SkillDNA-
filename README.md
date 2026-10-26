[README.md](https://github.com/user-attachments/files/33979249/README.md)
# SkillDNA — Skill Intelligence & Career Development

A responsive, interactive front-end prototype for an AI-powered skill intelligence and career development platform.

## Features

- Responsive dashboard for desktop, tablet, and mobile
- Interactive skill proficiency sliders
- Rule-based sample career alignment scores
- Career explorer for web development, data analytics, and UX/UI design
- Four-step learning roadmap with completion tracking
- Editable display name and career goal
- Dark and light themes
- Browser-local persistence using `localStorage`
- Accessible labels, keyboard focus states, and reduced-motion support

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Google Fonts (DM Sans and Space Grotesk)

## Run locally

1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` in your browser.

For a local development server, use the VS Code **Live Server** extension.

## Deploy with GitHub Pages

1. Create a GitHub repository named `skilldna` (or another name you prefer).
2. Upload `index.html`, `styles.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages** in your repository.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/ (root)`, then save.
6. Wait for GitHub Pages to publish the site. Your website URL will appear in the Pages section.

You can also import the repository into Netlify and deploy it as a static site. No build command is required.

## Important prototype notes

The current website uses sample data and transparent, rule-based calculations. It does **not** call an AI model, verify real-world job-market demand, authenticate users, or sync data to a server.

To make this a production AI platform, add:
- A backend API (for example, Node.js and Express)
- Secure authentication and database storage
- A server-side integration with an AI provider
- Server-side validation, rate limiting, privacy controls, and error handling
- Real skill assessment questions and a documented scoring methodology

**Never put private API keys in `script.js` or any other browser-delivered file.** Keep them in server-side environment variables.

## Project structure

```text
SkillDNA/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Customization

- Edit default profile and skill values in `script.js`.
- Change role descriptions and scoring rules in the `careers` object in `script.js`.
- Update colors and responsive layouts in `styles.css`.
- Add new sections and content in `index.html`.

## License

Choose a license before making the repository public. For a student project, MIT is a common permissive option; make sure it fits your intended use.
