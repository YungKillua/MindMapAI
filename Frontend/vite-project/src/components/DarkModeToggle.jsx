
import { useEffect, useState, useContext} from "react";
import { MindmapContext } from "/src/components/Context";

export default function DarkModeToggle() {
  const {darkMode, setDarkMode} = useContext(MindmapContext);

  return (
    <button
      className="p-2 rounded-full transition-all bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
