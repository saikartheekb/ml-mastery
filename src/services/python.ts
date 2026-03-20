// Python Playground Service - Runs Python code in browser using Pyodide

declare global {
  interface Window {
    loadPyodide: any;
  }
}

let pyodide: any = null;
let isLoading = false;

export interface CodeResult {
  output: string;
  error?: string;
}

// Load Pyodide script dynamically
function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide script'));
    document.head.appendChild(script);
  });
}

// Load Pyodide (only once)
export async function loadPyodideEngine(): Promise<boolean> {
  if (pyodide) return true;
  if (isLoading) return false;
  
  isLoading = true;
  
  try {
    await loadPyodideScript();
    
    pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    });
    
    // Load commonly used packages
    await pyodide.loadPackage(['numpy', 'pandas', 'matplotlib']);
    
    console.log('Pyodide loaded successfully!');
    return true;
  } catch (error) {
    console.error('Failed to load Pyodide:', error);
    isLoading = false;
    return false;
  }
}

// Run Python code
export async function runPythonCode(code: string): Promise<CodeResult> {
  try {
    // Load Pyodide if not loaded
    if (!pyodide) {
      const loaded = await loadPyodideEngine();
      if (!loaded) {
        return { output: '', error: 'Failed to load Python environment. Please try again.' };
      }
    }
    
    // Capture stdout
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);
    
    // Run the user's code
    await pyodide.runPythonAsync(code);
    
    // Get stdout and stderr
    const stdout = pyodide.runPython('sys.stdout.getvalue()');
    const stderr = pyodide.runPython('sys.stderr.getvalue()');
    
    // Reset stdout/stderr
    pyodide.runPython(`
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);
    
    if (stderr && stderr.trim()) {
      return { output: stdout || '', error: stderr };
    }
    
    return { output: stdout || 'Code executed successfully (no output)' };
  } catch (error: any) {
    return { output: '', error: error.message || 'Error executing code' };
  }
}

// Run Python with visualization support
export async function runPythonWithVisualization(code: string): Promise<{
  output: string;
  error?: string;
  plotUrl?: string;
}> {
  const result = await runPythonCode(code);
  
  // Check if matplotlib was used and has figures
  if (pyodide && !result.error) {
    try {
      const hasFigures = pyodide.runPython(`
import matplotlib.pyplot as plt
if plt.get_fignums():
    import base64
    from io import BytesIO
    buf = BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='white')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close('all')
    img_str
else:
    ''
      `);
      
      if (hasFigures && hasFigures.trim()) {
        return { ...result, plotUrl: `data:image/png;base64,${hasFigures}` };
      }
    } catch {
      // No plot generated
    }
  }
  
  return result;
}

// Get available Python packages
export function getAvailablePackages(): string[] {
  return ['numpy', 'pandas', 'matplotlib', 'scikit-learn', 'scipy'];
}

// Check if Pyodide is loaded
export function isPyodideReady(): boolean {
  return pyodide !== null;
}
