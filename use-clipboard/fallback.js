const clipboardAsyncAPI = {
    available: () => navigator.clipboard && navigator.clipboard.writeText,
    copy: text => navigator.clipboard.writeText(text),
  };

const execCommandAPI = {
  available: () => !!document.execCommand,
  copy: (text) => new Promise((resolve, reject) => {
    const range = document.createRange();
    const selection = window.getSelection();
    const placeholder = document.createElement('span');
    
    placeholder.textContent = text;
    placeholder.style.width = '0';
    placeholder.style.height = '0';
    placeholder.style.opacity = '0';
  
    document.body.appendChild(placeholder);
  
    range.selectNodeContents(placeholder);
    selection.removeAllRanges();
    selection.addRange(range);
  
    const copied = document.execCommand('copy', false, null);
  
    document.body.removeChild(placeholder);
  
    return !copied ? reject() : resolve();
  })
};

const throwErrorAPI = {
  available: () => true,
  copy: (text) => {
    throw new Error(`There was an error while copying ${text}`);
  }
};

const fallbacks = [
  clipboardAsyncAPI,
  execCommandAPI,
  throwErrorAPI
];


export default function findAPI() {
  const { copy } = fallbacks.find((fallback) => fallback.available());

  return copy;
}
