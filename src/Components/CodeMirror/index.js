import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';
import styles from './index.module.css'
import { oneDark } from "@codemirror/theme-one-dark";

export default function Code({ propCodeWidth, propCodeHeight, scripts = [] }) {
  const [id, setId] = useState(2)
  const [result, setResult] = useState('')
  const [tabs, setTabs] = useState(scripts)
  const [selectedTab, setSelectedTab] = useState(0)

  const deleteTab = (toDelete) => {
    if (tabs.length === 1) return;
    if (selectedTab === toDelete) setSelectedTab(0)
    else if (selectedTab > toDelete) setSelectedTab(selectedTab - 1)
    const newTabs = tabs.filter((item, index) => index !== toDelete)
    setTabs(newTabs)
  }

  const addTab = () => {
    setTabs([...tabs, { name: `script ${id}`, code: '' }]);
    setId(id + 1)
    setSelectedTab(tabs.length)
  }

  return (
    <div>
      <div className={styles['tabs-bar']} />
      <div style={{display: 'flex'}}>
        <div className={styles['tabs-wrapper']}>
          <div className={styles['tabs-container']} style={{width: `${propCodeWidth - 30}px`}}>
            {tabs.map((t,i) => {
                return (
                    <div 
                    key={i} 
                    className={styles['tab']}
                    style={{background: selectedTab !== i ? '#225866' : '#282c34'}}
                    >
                        <div onClick={() => setSelectedTab(i)} className={styles['tab-name']}>{t.name}</div>
                        <div onClick={() => deleteTab(i)}>x</div>
                    </div>
                )        
            })}
          </div>
          {tabs.length < 4 && 
            <div onClick={() => addTab()} className={styles['add-tab']}> 
              +
            </div>
          }
        </div>
      </div>
        <div>
          <CodeMirror
            value={tabs[selectedTab].code}
            height={`${propCodeHeight - 90}px`}
            width={`${propCodeWidth}px`}
            extensions={[javascript({ jsx: true })]}
            onChange={(value, viewUpdate) => {
              if (viewUpdate.changes.sections.length === 2) return;
              setTabs(tabs.map((t, i) => {
                if (i === selectedTab) return { ...t, code: value};
                  return t;
              }))
            }}
            theme={oneDark}
          />
        </div>
        <div 
          onClick={() => setResult(eval(tabs[selectedTab].code))} 
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