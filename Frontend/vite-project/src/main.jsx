import { createRoot } from 'react-dom/client';
import { MindmapProvider } from '/src/components/Context';
import App from './App';
import './index.css';
 
const container = document.querySelector('#app');
const root = createRoot(container);
 
root.render(
<MindmapProvider>
    <App />
</MindmapProvider>
);