import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';
import styles from './index.module.css'

export default function Code({ propCodeWidth, propCodeHeight }) {
  const [code, setCode] = useState("console.log('hello world!')")
  const [result, setResult] = useState('')
  const [tabs, setTabs] = useState(['Yourrrrrrrrrrrrrrrrrr script', 'script 2'])
  const [selectedTab, setSelectedTab] = useState(0)

  const deleteTab = (toDelete) => {
    if (tabs.length === 1) return;
    console.log(selectedTab, toDelete)
    if (selectedTab === toDelete) setSelectedTab(0)
    else if (selectedTab > toDelete) setSelectedTab(selectedTab - 1)
    const newTabs = tabs.filter((item, index) => index !== toDelete)
    setTabs(newTabs)
  }

  return (
    <div>
        <div className={styles['tabs-bar']} />
        <div style={{display: 'flex'}}>
            <div className={styles['tabs-wrapper']}>
                <div className={styles['tabs-container']}>
                    {tabs.map((t,i) => {
                        return (
                            <div 
                            key={i} 
                            className={styles['tab']}
                            style={{background: selectedTab !== i ? '#225866' : '#0b2b33'}}
                            >
                                <div onClick={() => setSelectedTab(i)} className={styles['tab-name']} >{t}</div>
                                <div onClick={() => deleteTab(i)}>x</div>
                            </div>
                        )        
                    })}
                </div>
                <div onClick={() => setTabs([...tabs, `script ${tabs.length + 1}`])} className={styles['add-tab']}>+</div>
            </div>
        </div>
        <div>
            <CodeMirror
                value={code}
                height={`${propCodeHeight - 90}px`}
                width={`${propCodeWidth}px`}
                extensions={[javascript({ jsx: true })]}
                onChange={(value, viewUpdate) => {
                    setCode(value)
                }}
            />
        </div>
        <div 
            onClick={() => setResult(eval(code))} 
            style={{margin: 'auto', padding: '10px', background: 'grey', color: 'white'}}
        >
            <span>Run</span>
        </div>
        <div style={{background:'#073642', color: 'white'}}>Your script says: {result}</div>
    </div>
  );
}