import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';
import styles from './index.module.css'
import { oneDark } from "@codemirror/theme-one-dark";

export default function Code({ propCodeWidth, propCodeHeight, code = '', onCodeChange }) {
  const [result, setResult] = useState('')

  return (
    <div>
        <div>
          <CodeMirror
            value={code}
            height={`${propCodeHeight - 90}px`}
            width={`${propCodeWidth}px`}
            extensions={[javascript({ jsx: true })]}
            onChange={(value, viewUpdate) => {
              if (viewUpdate.changes.sections.length === 2) return;
              onCodeChange(value)
            }}
            theme={oneDark}
          />
        </div>
        <div 
          onClick={() => setResult(eval(code))} 
          className={styles['commands']}
        >
          <span>Run</span>
        </div>
        <div className={styles['output']}>
          Your script says: {result}
        </div>
    </div>
  );
}