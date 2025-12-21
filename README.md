# TymOra - Personal Activity Tracker

TymOra is a modern, privacy-focused activity tracking and time management application designed to help you understand and optimize how you spend your time. With a sleek interface and intuitive controls, TymOra makes it easy to log your daily routines and gain valuable insights into your productivity and habits.

## 🚀 Key Features

- **Real-time Tracking:** Start a timer for your current activity with a single click.
- **Manual Logging:** Easily log past activities or edit existing ones with a user-friendly form.
- **Visual Analytics:** Interactive pie charts provide a clear breakdown of your time distribution across categories like Work, Personal, Home, Learning, and more.
- **Timeline & History:** View your day at a glance with a chronological timeline, or explore your past logs in the History tab.
- **Configurable Retention:** Keep your data lean with a customizable history retention policy (1-7 days).
- **Personalized Themes:** Choose from multiple premium color themes (Ocean, Forest, Sunset, etc.) to match your style.
- **Privacy First:** All your data is stored locally in your browser's `localStorage`. No accounts, no tracking, no data leaves your device.

## 🛠️ Technical Stack

TymOra is built with a modern, high-performance tech stack:

- **Framework:** [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) for robust, type-safe development.
- **Build Tool:** [Vite](https://vitejs.dev/) for lightning-fast development and optimized production builds.
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) for a modern, responsive, and utility-first design system.
- **Routing:** [React Router 7](https://reactrouter.com/) for seamless client-side navigation.
- **Data Visualization:** [Recharts](https://recharts.org/) for beautiful, responsive charts.
- **Icons:** [Lucide React](https://lucide.dev/) for a consistent and crisp icon set.
- **Date Utilities:** [date-fns](https://date-fns.org/) for reliable date and time manipulation.

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TymOra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the App

- **Development Mode:**
  Start the development server with Hot Module Replacement (HMR):
  ```bash
  npm run dev
  ```
  The app will be available at `http://localhost:5173`.

- **Production Build:**
  Create an optimized production build in the `dist` folder:
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  Preview the production build locally:
  ```bash
  npm run preview
  ```

- **Linting:**
  Run ESLint to check for code quality and style issues:
  ```bash
  npm run lint
  ```

## 📂 Project Structure

- `src/components`: Reusable UI components (Timer, Activity Lists, Charts).
- `src/context`: React Context for global state management (Theme, Data, Active Activity).
- `src/lib`: Utility functions and storage logic.
- `src/pages`: Main application views (Home, Log Activity, Summary, Settings).
- `src/types`: TypeScript interfaces and constants.
- `src/styles`: Global styles and Tailwind configuration.

---

Built with ❤️ for productivity.
