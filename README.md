# Campaign Analytics Dashboard

> **Last Updated**: January 23, 2025 - Project has been updated with latest changes and improvements.

A modern, responsive analytics dashboard built with React, TypeScript, and Tailwind CSS. This dashboard provides comprehensive campaign performance metrics and analytics visualization.

## Features

- **Campaign Performance Overview**
  - Real-time metrics display (Clicks, Total Spend, Impressions)
  - Interactive area charts for trend visualization
  - Date range selection for custom time periods

- **Geographic Distribution**
  - Region-wise performance breakdown
  - Dynamic metric filtering (CTR, CPC, CPM)
  - Visual progress indicators
  - Country-specific performance tracking

- **Interactive Components**
  - Responsive data tables
  - Dynamic metric toggles
  - Real-time data updates
  - Performance trend indicators

## Running Locally

### Prerequisites

1. **Node.js Installation**
   - Install Node.js (v16 or higher)
   - Recommended: Use [nvm](https://github.com/nvm-sh/nvm) for Node.js version management
   ```bash
   # Using nvm
   nvm install 16
   nvm use 16
   ```

2. **Package Manager**
   - The project uses npm by default
   - You can also use yarn if preferred

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/campaign-analytics-dashboard.git
   cd campaign-analytics-dashboard
   ```

2. **Install Dependencies**
   ```bash
   # Using npm
   npm install

   # Or using yarn
   yarn install
   ```

3. **Start Development Server**
   ```bash
   # Using npm
   npm run dev

   # Or using yarn
   yarn dev
   ```

4. **Access the Application**
   - Open your browser and navigate to [http://localhost:5173](http://localhost:5173)
   - The app should hot-reload as you make changes

### Troubleshooting

1. **Port Conflicts**
   - If port 5173 is in use, Vite will automatically try the next available port
   - You can manually change the port in `vite.config.ts`

2. **Dependencies Issues**
   - If you encounter dependency conflicts:
     ```bash
     # Clear npm cache
     npm cache clean --force
     
     # Remove node_modules and reinstall
     rm -rf node_modules
     npm install
     ```

3. **TypeScript Errors**
   - Run type checking separately:
     ```bash
     npm run typecheck
     ```

4. **Development Environment**
   - Ensure your IDE has TypeScript and React extensions installed
   - Recommended VSCode extensions:
     - ESLint
     - Prettier
     - TypeScript + JavaScript
     - Tailwind CSS IntelliSense

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- React Simple Maps
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/campaign-analytics-dashboard.git
cd campaign-analytics-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  ├── components/           # React components
  │   ├── ui/              # Reusable UI components
  │   ├── AnalyticsDashboard.tsx
  │   ├── RegionDistribution.tsx
  │   ├── MapComponent.tsx
  │   └── ...
  ├── pages/               # Page components
  ├── styles/              # Global styles
  └── App.tsx             # Root component
```

## Component Documentation

### AnalyticsDashboard
Main dashboard component that displays overall campaign performance metrics.

### RegionDistribution
Displays geographic distribution of campaign performance with:
- Country-wise breakdown
- Metric selection (CTR, CPC, CPM)
- Performance change indicators

### MapComponent
Interactive map visualization showing:
- Regional performance heatmap
- Country-specific highlights
- Performance indicators

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from modern analytics dashboards
- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Map visualization powered by [react-simple-maps](https://www.react-simple-maps.io/)
