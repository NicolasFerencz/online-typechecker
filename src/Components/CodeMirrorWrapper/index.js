import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/stream-parser';
import styles from './index.module.css'
import { oneDark } from "@codemirror/theme-one-dark";
import { elixir } from 'codemirror-lang-elixir'
import { basicSetup } from '@codemirror/basic-setup'
import { EditorView } from '@codemirror/view';

const theme = EditorView.theme({
  "&.cm-editor": {
    padding: "0  0 10px 0",
    fontSize: "10px",
    fontFamily: "Roboto Mono, sans-serif",
    border: 'none!important'
  },
  ".cm-lineNumbers .cm-gutterElement": {
    minWidth: "20px",
    fontFamily: "Roboto Mono, sans-serif",
  },
});

const Options = ['Run', 'Annotate', 'Typecheck', 'Log', 'Clear']

export default function Code({ propCodeWidth, propCodeHeight, code = '', withOptions = true, runCommand, locked }) {

  return (
    <div>
        <div>
          <CodeMirror
            value={code}
            height={`${propCodeHeight - 50}px`}
            width={`${propCodeWidth}px`}  
            onChange={(value, viewUpdate) => {}}
            minWidth={'350px'}
            maxWidth={`${window.innerWidth - 350}px`}
            theme={[oneDark, basicSetup, StreamLanguage.define(elixir)]}
            extensions={theme}
            editable={!locked}
          />
        </div>
        <div className={styles['commands']} style={{cursor: locked ? 'wait' : ''}}>
          {withOptions && Options.map((o, i) => {
            return (
              <>
                <span 
                  key={i} 
                  onClick={() => { if(!locked) runCommand(o.toLowerCase()) }}
                  style={{cursor: locked ? 'wait' : 'pointer' }}
                  className={styles['command']}
                >
                  {o}
                </span>
                {i !== Options.length - 1 && <span>|</span>}
              </>
            )
          })}
        </div>
    </div>
  );
}