import CodeMirror from '../CodeMirror';
import { useState, useCallback, useEffect } from 'react';
import styles from './index.module.css'
import Document from '../Document';
import { scripts as exampleScripts }  from '../../example-scripts';
import { io } from 'socket.io-client'

const socket = io("ws://localhost:3000")

const minDrawerWidth = 50;
const maxDrawerWidth = 1000;
const minDrawerHeight = 50;
const maxDrawerHeight = 1000;

export default function Holder() {
  const [id, setId] = useState(1)
  const [width, setWidth] = useState(window.innerWidth/2)
  const [height, setHeight] = useState(450)
  const [scripts, setScripts] = useState(exampleScripts)
  const [selected, setSelected] = useState(0)

  const handleResize = () => {
    setWidth(window.innerWidth/2)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    console.log('useeffect!')
    socket.on('input', (arg) => { console.log('desde el socket: ' + arg); WriteSecondCode(arg) })
  },[])

  const handleMouseDownW = (e) => {
    document.addEventListener("mouseup", handleMouseUpW, true);
    document.addEventListener("mousemove", handleMouseMoveW, true);
  };

  const handleMouseUpW = () => {
    document.removeEventListener("mouseup", handleMouseUpW, true);
    document.removeEventListener("mousemove", handleMouseMoveW, true);
  };

  const handleMouseMoveW = useCallback(e => {
    const newWidth = e.clientX - document.body.offsetLeft;
    if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
      setWidth(newWidth);
    }
  }, []);

  const handleMouseDownH = (e) => {
    document.addEventListener("mouseup", handleMouseUpH, true);
    document.addEventListener("mousemove", handleMouseMoveH, true);
  };

  const handleMouseUpH = () => {
    document.removeEventListener("mouseup", handleMouseUpH, true);
    document.removeEventListener("mousemove", handleMouseMoveH, true);
  };

  const handleMouseMoveH = useCallback(e => {
    const newHeight = e.clientY - document.body.offsetTop;
    if (newHeight > minDrawerHeight && newHeight < maxDrawerHeight) {
      setHeight(newHeight);
    }
  }, []);

  const deleteTab = (name, index) => {
    if (selected === index) setSelected(scripts.findIndex(s => s.showing))
    if(scripts.filter(s => s.showing).length === 1) return 
    setScripts(scripts.map((s, i) => { 
      if (s.name !== name) return s
      return { ...s, showing: false };
    }))
    console.log(scripts[selected].showing)
  }

  const addTab = (name) => {
    setScripts(scripts.map((s, i) => {
      if (s.name !== name) return s;
      setSelected(i)
      return { ...s, showing: true };
    }))
  }

  const selectTab = (name) => {
    setSelected(scripts.findIndex(s => s.name === name))
  }

  const addScript = () => {
    setScripts([...scripts, { name: `Script ${id}`, code: '', showing: true, deletable: false }])
    setId(id + 1)
  }

  const onCodeChange = (newCode) => {
    scripts[selected].code = newCode;
  }

  const previousToSelectedTabOrLastTab = (name) => {
    const onlyShowing = scripts.filter(s => s.showing)
    if(onlyShowing[onlyShowing.length - 1].name === name) return true;
    const activeInShowingIndex = onlyShowing.findIndex(s => s.name === scripts[selected].name)
    if(activeInShowingIndex === 0) return false;
    return onlyShowing[activeInShowingIndex - 1].name === name;
  }

  const WriteSecondCode = (newCode) => {
    let newSecondCode;
    console.log('sc', scripts[selected].secondCode)
    if(!scripts[selected].secondCode) newSecondCode = newCode;
    else newSecondCode = `${scripts[selected].secondCode}${newCode}`
    setScripts(scripts.map((s, i) => {
      if(i !== selected) return s;
      return { ...s, secondCode: newSecondCode }
    }))
  }

  const EvaluateCode = (type) => {
    setScripts(scripts.map((s, i) => {
      if(i !== selected) return s;
      if(type === 'Clear') return { ...s, secondCode: ''}
      return { ...s, secondCode: 'Executed ' + type + ' for ' + s.name}
    }))
  }
  
  return (
    <div>
      <div className={styles['tabs-bar']} />
      <div style={{display: 'flex'}}>
        <div className={styles['tabs-wrapper']}>
          <div className={styles['tabs-container']} style={{width: `${window.innerWidth - 30}px`}}>
            {scripts.map((t,i) => {
                if(!t.showing) return '';
                return (
                  <>
                    <div 
                      key={i} 
                      className={styles['tab']}
                      style={{background: scripts[selected].name === t.name ? '#225866' : '#282c34'}}
                    >
                      <div onClick={() => selectTab(t.name)} className={styles['tab-name']}>{t.name}</div>
                      <div onClick={() => deleteTab(t.name, i)} >x</div>
                    </div>
                    {selected !== i && !previousToSelectedTabOrLastTab(t.name) &&
                      <div className={styles['divider']}></div>
                    }
                  </>
                )        
            })}
          </div>
          <div className={styles['add-tab']} onClick={() => addScript()}> 
            +
          </div>
        </div>
      </div>
      <div style={{display: 'flex', borderTop: '5px solid #002b36'}}>
        <CodeMirror
          evaluation={(type) => EvaluateCode(type)}
          onCodeChange={(newCode) => onCodeChange(newCode)}
          code={scripts[selected].code}
          propCodeWidth={width}
          propCodeHeight={height}
        />
        <div onMouseDown={e => handleMouseDownW(e)} className={styles['width-dragger']} />
        <CodeMirror 
          evaluation={(type) => EvaluateCode(type)}
          code={scripts[selected].secondCode || ''}
          propCodeWidth={window.innerWidth - width}
          propCodeHeight={height}
          withOptions={false}
        />
      </div>
      <div onMouseDown={e => handleMouseDownH(e)} className={styles['height-dragger']} />
      <Document 
        addTab={(name) => addTab(name)}
        propCodeHeight={window.innerHeight - height}
      />
    </div>
  );
}