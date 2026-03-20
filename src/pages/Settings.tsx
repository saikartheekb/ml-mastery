import React, { useState, useEffect } from 'react';
import { supabase, api } from '../services/supabase';
import { AIProvider } from '../services/ai';
import './Settings.css';

const Settings: React.FC = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState({ openai: false, anthropic: false });

  // Generate a simple user ID (in production, use Supabase Auth)
  const userId = 'local-user';

  useEffect(() => {
    // Load saved settings
    const loadSettings = async () => {
      if (supabase) {
        const { data } = await api.getUserSettings(userId);
        if (data) {
          setOpenaiKey(data.openai_api_key || '');
          setAnthropicKey(data.anthropic_api_key || '');
          setProvider(data.ai_provider || 'openai');
        }
      } else {
        // Load from localStorage as fallback
        const saved = localStorage.getItem('ai_settings');
        if (saved) {
          const settings = JSON.parse(saved);
          setOpenaiKey(settings.openaiKey || '');
          setAnthropicKey(settings.anthropicKey || '');
          setProvider(settings.provider || 'openai');
        }
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    const settings = {
      openai_api_key: openaiKey,
      anthropic_api_key: anthropicKey,
      ai_provider: provider
    };

    if (supabase) {
      await api.saveUserSettings(userId, settings);
    } else {
      // Save to localStorage as fallback
      localStorage.setItem('ai_settings', JSON.stringify({
        openaiKey: openaiKey,
        anthropicKey: anthropicKey,
        provider: provider
      }));
    }

    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const clearKeys = () => {
    setOpenaiKey('');
    setAnthropicKey('');
    localStorage.removeItem('ai_settings');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Configure your AI preferences and API keys</p>
      </div>

      <div className="settings-section">
        <h2>🤖 AI Provider</h2>
        <p className="section-description">
          Choose which AI service to use for explanations and quizzes
        </p>
        
        <div className="provider-options">
          <label className={`provider-option ${provider === 'openai' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="provider"
              value="openai"
              checked={provider === 'openai'}
              onChange={() => setProvider('openai')}
            />
            <div className="provider-info">
              <span className="provider-name">OpenAI (GPT-3.5)</span>
              <span className="provider-desc">Fast and affordable</span>
            </div>
          </label>

          <label className={`provider-option ${provider === 'anthropic' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="provider"
              value="anthropic"
              checked={provider === 'anthropic'}
              onChange={() => setProvider('anthropic')}
            />
            <div className="provider-info">
              <span className="provider-name">Anthropic (Claude)</span>
              <span className="provider-desc">Great for explanations</span>
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>🔑 API Keys</h2>
        <p className="section-description">
          Your API keys are stored locally and never sent to our servers. 
          Costs are billed directly by the AI provider.
        </p>

        <div className="api-key-field">
          <label>
            OpenAI API Key
            <span className="optional">(optional)</span>
          </label>
          <div className="key-input-wrapper">
            <input
              type={showKeys.openai ? 'text' : 'password'}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
            >
              {showKeys.openai ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="get-key-link"
          >
            Get OpenAI Key →
          </a>
        </div>

        <div className="api-key-field">
          <label>
            Anthropic API Key
            <span className="optional">(optional)</span>
          </label>
          <div className="key-input-wrapper">
            <input
              type={showKeys.anthropic ? 'text' : 'password'}
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-..."
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowKeys(prev => ({ ...prev, anthropic: !prev.anthropic }))}
            >
              {showKeys.anthropic ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <a 
            href="https://www.anthropic.com/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="get-key-link"
          >
            Get Anthropic Key →
          </a>
        </div>
      </div>

      <div className="settings-section">
        <h2>💰 Pricing Info</h2>
        <div className="pricing-info">
          <div className="pricing-card">
            <h3>OpenAI</h3>
            <p>~$0.002 per 1K tokens (GPT-3.5)</p>
            <p className="estimate">~5-10 questions = ~$0.01</p>
          </div>
          <div className="pricing-card">
            <h3>Anthropic</h3>
            <p>~$0.00025 per 1K tokens (Claude Haiku)</p>
            <p className="estimate">~50-100 questions = ~$0.01</p>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : '💾 Save Settings'}
        </button>
        <button 
          className="clear-button" 
          onClick={clearKeys}
        >
          🗑️ Clear All Keys
        </button>
        {saved && <span className="saved-message">✓ Settings saved!</span>}
      </div>

      <div className="settings-section privacy">
        <h2>🔒 Privacy</h2>
        <ul>
          <li>API keys are stored only in your browser (localStorage)</li>
          <li>Your keys are never sent to our servers</li>
          <li>Each API request goes directly from your browser to the AI provider</li>
          <li>We don't track your AI usage</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
