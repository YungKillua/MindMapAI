module.exports = {
  darkMode: "class", // Aktiviert den Dark-Mode mit Klassen
  content: ['.index.html', '.index.css',
    './src/**/*.{js,jsx,ts,tsx}', // Achte darauf, dass alle deine Dateien mit Tailwind CSS verarbeitet werden
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#1E40AF",  // Blau für Buttons, Links (Light Mode)
          dark: "#2563EB",   // Kräftiges Blau für Dark Mode
        },
        background: {
          light: "#F9FAFB", // Heller Hintergrund (Light Mode)
          dark: "#0D0D0D",  // Fast schwarz für Dark Mode
        },
        sidebar: {
          light: "#E5E7EB", // Helles Grau für Sidebar (Light Mode)
          dark: "#1F2937",  // Dunkles Grau für Sidebar (Dark Mode)
        },
        topbar: {
          light: "#FFFFFF", // Weiß für die Topbar (Light Mode)
          dark: "#111827",  // Dunkles Blau-Grau für Dark Mode
        },
        card: {
          light: "#FFFFFF", // Karten oder Boxen im Light Mode
          dark: "#1E1E1E",  // Karten im Dark Mode
        },
        text: {
          light: "#111827", // Sehr dunkles Grau für Text (Light Mode)
          dark: "#D1D5DB",  // Helles Grau für Text (Dark Mode)
        },
        border: {
          light: "#D1D5DB", // Helle Border für Abtrennung (Light Mode)
          dark: "#374151",  // Dunklere Border für Dark Mode
        },
      },
    },
  },
  plugins: [],
};
