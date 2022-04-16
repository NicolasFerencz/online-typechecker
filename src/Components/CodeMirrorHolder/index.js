import CodeMirrorWrapper from '../CodeMirrorWrapper';
import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './index.module.css'
import Document from '../Document';
import { scripts as exampleScripts }  from '../../example-scripts';
import { io } from 'socket.io-client'

const socket = io("ws://localhost:3001")

const minDrawerWidth = 50;
const maxDrawerWidth = 1000;
const minDrawerHeight = 50;
const maxDrawerHeight = 1000;

export default function Holder() {
  const [width, setWidth] = useState(window.innerWidth/2)
  const [height, setHeight] = useState(450)
  const [script, setScript] = useState('')
  const [secondScript, setSecondScript] = useState('')
  const [locked, setLocked] = useState(false)
  const secondScriptAux = useRef('')

  const handleResize = () => {
    setWidth(window.innerWidth/2)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    socket.on('input', (arg) => onSecondScript(arg))
    socket.on('lock', () => setLocked(true))
    socket.on('unlock', () => setLocked(false))
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

  const selectScript = (name) => {
    setScript(exampleScripts.find(s => s.name === name).code)
  }

  const runCommand = (type) => {
    secondScriptAux.current = ''
    setSecondScript('')
    if(type !== 'clear') socket.emit(type)
  }

  const onSecondScript = (arg) => {
    secondScriptAux.current = secondScriptAux.current + arg
    setSecondScript(secondScriptAux.current)
  }

  return (
    <div>
      <div style={{display: 'flex', borderTop: '5px solid #002b36'}}>
        <CodeMirrorWrapper
          code={script}
          propCodeWidth={width}
          propCodeHeight={height}
          runCommand={(o) => runCommand(o)}
          locked={locked}
        />
        <div onMouseDown={e => handleMouseDownW(e)} className={styles['width-dragger']} />
        <CodeMirrorWrapper
          code={secondScript}
          propCodeWidth={window.innerWidth - width}
          propCodeHeight={height}
          withOptions={false}
          locked={true}
        />
      </div>
      <div onMouseDown={e => handleMouseDownH(e)} className={styles['height-dragger']} />
      <Document 
        addTab={(name) => selectScript(name)}
        propCodeHeight={window.innerHeight - height}
      />
    </div>
  );
}