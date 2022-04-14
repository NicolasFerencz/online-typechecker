import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/stream-parser';
import { useState } from 'react';
import styles from './index.module.css'
import { oneDark } from "@codemirror/theme-one-dark";
import { elixir } from 'codemirror-lang-elixir'
import { basicSetup } from '@codemirror/basic-setup'


export default function Code({ propCodeWidth, propCodeHeight, code = '', onCodeChange }) {
  const [result, setResult] = useState('')

  return (
    <div>
        <div>
          <CodeMirror
            value={code}
            height={`${propCodeHeight - 90}px`}
            width={`${propCodeWidth}px`}
            extensions={[basicSetup, StreamLanguage.define(elixir)]}
            mode={'elixir'}
            onChange={(value, viewUpdate) => {
              if (viewUpdate.changes.sections.length === 2) return;
              onCodeChange(value)
            }}
            options={{

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