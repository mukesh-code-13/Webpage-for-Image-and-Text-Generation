import { useState } from 'react';
import Navbar from './components/Navbar';
import WorkflowText from './components/WorkflowText';
import WorkflowImage from './components/WorkflowImage';
import { Loader } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-grid">
        <section className="panel panel-info">
          <h2>Pear Media AI Labs</h2>
          <p>
            Two workflows in one interface: text enhancement + image generation, and image analysis + style variation.
          </p>
          <div className="tab-bar">
            <button
              className={activeTab === 'text' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('text')}
            >
              Creative Studio
            </button>
            <button
              className={activeTab === 'image' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('image')}
            >
              Style Lab
            </button>
          </div>
          <div className="panel-card">
            {activeTab === 'text' ? (
              <WorkflowText setGlobalLoading={setIsLoading} />
            ) : (
              <WorkflowImage setGlobalLoading={setIsLoading} />
            )}
          </div>
        </section>
      </main>

      {isLoading && (
        <div className="loader-overlay" role="status" aria-live="polite">
          <Loader className="spinner" />
          <span>Processing AI workflow...</span>
        </div>
      )}
    </div>
  );
}

export default App;
