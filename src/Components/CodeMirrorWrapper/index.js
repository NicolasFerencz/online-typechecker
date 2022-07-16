import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/stream-parser';
import { oneDark } from '@codemirror/theme-one-dark';
import { elixir } from 'codemirror-lang-elixir';
import { basicSetup } from '@codemirror/basic-setup';
import { EditorView } from '@codemirror/view';
import styles from './index.module.css';

const theme = EditorView.theme({
  '&.cm-editor': {
    padding: '0  0 10px 0',
    fontSize: '10px',
    fontFamily: 'Roboto Mono, sans-serif',
    border: 'none!important',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    minWidth: '20px',
    fontFamily: 'Roboto Mono, sans-serif',
  },
});

const Options = ['Typecheck', 'Typecheck static', 'Annotate types', 'Annotate casts'];

export default function CodeMirrorWrapper({
  propCodeWidth, propCodeHeight, code = '', withOptions = true, runCommand, locked, isElixir,
}) {
  const [script, setScript] = useState(code);
  const themes = [oneDark];
  if (isElixir) {
    themes.push(StreamLanguage.define(elixir));
    themes.push(basicSetup);
  }

  return (
    <div>
      <div>
        <CodeMirror
          value={code}
          height={`${propCodeHeight - 50}px`}
          width={`${propCodeWidth}px`}
          onChange={(value) => setScript(value)}
          minWidth="450px"
          maxWidth={`${window.innerWidth - 450}px`}
          theme={themes}
          extensions={theme}
          editable={!locked}
        />
      </div>
      <div className={styles.commands} style={{ cursor: locked ? 'wait' : '' }}>
        {withOptions && Options.map((o, i) => (
          <div key={i}>
            <span
              onClick={() => { if (!locked) runCommand(o.toLowerCase(), script); }}
              style={{ cursor: locked ? 'wait' : 'pointer' }}
              className={styles.command}
            >
              {o}
            </span>
            {i !== Options.length - 1 && <span>|</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
