import Prism from 'prismjs';
import { useEffect } from 'react';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

import './code-theme.css';

interface CodeViewProps {
  code: string;
  lang: string;
}

export const CodeView = ({ code, lang }: CodeViewProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="p-2 bg-transparent border-none rounded-none m-0 text-xs">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
};
