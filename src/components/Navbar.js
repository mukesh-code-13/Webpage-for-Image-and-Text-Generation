import { ImageIcon, Sparkles } from 'lucide-react';

function Navbar() {
  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">Pear Media</p>
        <h1>Image + Text AI Generator</h1>
      </div>
      <div className="brand-pill">
        <Sparkles size={20} />
        <span>AI Prototype</span>
      </div>
    </header>
  );
}

export default Navbar;
