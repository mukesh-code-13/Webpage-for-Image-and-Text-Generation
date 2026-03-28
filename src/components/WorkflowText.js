import { useState } from 'react';
import { getEnhancedPrompt, generateImage } from '../utils/apiHelpers';
import ImageCard from './ImageCard';

function WorkflowText({ setGlobalLoading }) {
  const [userPrompt, setUserPrompt] = useState('A fantasy castle at sunset');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [approvedPrompt, setApprovedPrompt] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Start by writing a short concept and enhance it.');

  const handleEnhance = async () => {
    if (!userPrompt.trim()) {
      setStatusMessage('Please enter a short prompt before enhancing.');
      return;
    }

    setStatusMessage('Enhancing prompt...');
    setGlobalLoading(true);

    const enhanced = await getEnhancedPrompt(userPrompt);
    setEnhancedPrompt(enhanced);
    setApprovedPrompt(enhanced);
    setStatusMessage('Review the enhanced prompt, edit if needed, then generate the image.');
    setGlobalLoading(false);
  };

  const handleGenerate = async () => {
    if (!approvedPrompt.trim()) {
      setStatusMessage('Please approve a prompt before generating an image.');
      return;
    }
    setStatusMessage('Generating image from approved prompt...');
    setGlobalLoading(true);

    const imageData = await generateImage(approvedPrompt);
    if (imageData) {
      setResultImage(imageData);
      setStatusMessage('Image generated successfully.');
    } else {
      setStatusMessage('Image generation failed. Check your API key or try again.');
    }

    setGlobalLoading(false);
  };

  return (
    <section>
      <div className="input-group">
        <label htmlFor="userPrompt">Simple Text Prompt</label>
        <textarea
          id="userPrompt"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Describe the scene you want to generate..."
        />
        <button className="primary" onClick={handleEnhance}>Enhance Prompt</button>
      </div>

      {enhancedPrompt && (
        <div className="analysis-box">
          <label htmlFor="approvedPrompt">Enhanced Prompt (editable)</label>
          <textarea
            id="approvedPrompt"
            value={approvedPrompt}
            onChange={(e) => setApprovedPrompt(e.target.value)}
          />
          <button className="primary" onClick={handleGenerate}>Generate Image</button>
        </div>
      )}

      <p className="status-message">{statusMessage}</p>

      {resultImage && (
        <div className="result-section">
          <h3>Generated Image</h3>
          <ImageCard src={resultImage} alt="Generated asset" caption="Text workflow output" />
        </div>
      )}
    </section>
  );
}

export default WorkflowText;
