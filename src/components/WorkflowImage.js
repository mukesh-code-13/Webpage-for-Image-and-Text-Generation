import { useState } from 'react';
import { analyzeImage, generateImage } from '../utils/apiHelpers';
import ImageCard from './ImageCard';

function WorkflowImage({ setGlobalLoading }) {
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [variationPrompt, setVariationPrompt] = useState('');
  const [variationImage, setVariationImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Upload an image to begin analysis.');

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatusMessage('Loading image preview...');
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      setBase64Image(imageData);
      setPreviewUrl(imageData);
      setAnalysis(null);
      setVariationPrompt('');
      setVariationImage(null);
      setStatusMessage('Image loaded. Analyze the visual style to generate variations.');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!base64Image) {
      setStatusMessage('Please upload an image first.');
      return;
    }

    setStatusMessage('Analyzing the uploaded image...');
    setGlobalLoading(true);
    const result = await analyzeImage(base64Image);
    if (result) {
      setAnalysis(result);
      const prompt = `Create a new high-quality image using the following visual analysis: ${result.mainObjects}, ${result.colorPalette}, ${result.artisticStyle}, mood ${result.mood}.`;
      setVariationPrompt(prompt);
      setStatusMessage('Image analyzed. Edit the variation prompt or generate a new image.');
    } else {
      setStatusMessage('Analysis failed. Review your API configuration and try again.');
    }
    setGlobalLoading(false);
  };

  const handleGenerateVariation = async () => {
    if (!variationPrompt.trim()) {
      setStatusMessage('Please provide a variation prompt before generating.');
      return;
    }

    setStatusMessage('Generating variation image from analyzed style...');
    setGlobalLoading(true);
    const imageData = await generateImage(variationPrompt);
    if (imageData) {
      setVariationImage(imageData);
      setStatusMessage('Variation image generated successfully.');
    } else {
      setStatusMessage('Variation generation failed. Check your API key or model settings.');
    }
    setGlobalLoading(false);
  };

  return (
    <section>
      <div className="input-group">
        <label htmlFor="imageUpload">Upload Image</label>
        <input id="imageUpload" type="file" accept="image/*" onChange={handleFileUpload} />
        <button className="primary" onClick={handleAnalyze}>Analyze Image</button>
      </div>

      {previewUrl && (
        <div className="result-section">
          <h3>Preview</h3>
          <ImageCard src={previewUrl} alt={fileName || 'Uploaded image preview'} caption="Uploaded file preview" />
        </div>
      )}

      {analysis && (
        <div className="analysis-box">
          <h3>Visual Analysis</h3>
          <div className="metadata-grid">
            <div className="metadata-card">
              <strong>Main Objects</strong>
              <span>{analysis.mainObjects}</span>
            </div>
            <div className="metadata-card">
              <strong>Color Palette</strong>
              <span>{analysis.colorPalette}</span>
            </div>
            <div className="metadata-card">
              <strong>Art Style</strong>
              <span>{analysis.artisticStyle}</span>
            </div>
            <div className="metadata-card">
              <strong>Mood</strong>
              <span>{analysis.mood}</span>
            </div>
          </div>
          <label htmlFor="variationPrompt">Variation Prompt</label>
          <textarea
            id="variationPrompt"
            value={variationPrompt}
            onChange={(e) => setVariationPrompt(e.target.value)}
          />
          <button className="primary" onClick={handleGenerateVariation}>Generate Variation</button>
        </div>
      )}

      <p className="status-message">{statusMessage}</p>

      {variationImage && (
        <div className="result-section">
          <h3>Variation Output</h3>
          <ImageCard src={variationImage} alt="Style variation output" caption="Generated variation image" />
        </div>
      )}
    </section>
  );
}

export default WorkflowImage;
