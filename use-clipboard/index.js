import { useState, useEffect } from 'react';

import findAPI from './fallback';

const useClipboard = () => {
  const [clipboard, setClipboard] = useState('');
  const [clipboardAPI, setClipboardAPI] = useState(() => null);

  const copyToClipboard = async (text) => {
    await clipboardAPI(text);
    setClipboard(text);
  };

  useEffect(() => {
    setClipboardAPI(findAPI);
  }, []);

  return [clipboard, copyToClipboard];
};

export default useClipboard;