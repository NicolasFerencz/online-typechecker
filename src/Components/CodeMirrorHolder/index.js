import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import CodeMirrorWrapper from '../CodeMirrorWrapper';
import styles from './index.module.css';
import Document from '../Document';
import exampleScripts from '../../example-scripts';
import socket from '../../Services/client';

export default function Holder() {
  const [width, setWidth] = useState(window.innerWidth / 2);
  const [height, setHeight] = useState(450);
  const [script, setScript] = useState('');
  const [secondScript, setSecondScript] = useState('');
  const [locked, setLocked] = useState(false);
  const [isElixir, setIsElixir] = useState(false);
  const secondScriptAux = useRef('');

  const handleResize = () => {
    setWidth(window.innerWidth / 2);
  };

  const onSecondScript = ({ code, isElixirCode }) => {
    secondScriptAux.current += code;
    setSecondScript(secondScriptAux.current);
    setIsElixir(isElixirCode);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    socket.on('lock', () => setLocked(true));
    socket.on('unlock', () => setLocked(false));
    if (!socket.listeners('input').length) {
      socket.on('input', (arg) => onSecondScript(arg));
    }

    return (() => {
      window.removeEventListener('resize', handleResize);
      socket.removeListener('input', (arg) => () => onSecondScript(arg));
      socket.removeListener('lock', () => setLocked(true));
      socket.removeListener('unlock', () => setLocked(false));
    });
  }, []);

  const handleMouseMoveH = useCallback((e) => {
    const newHeight = e.clientY - document.body.offsetTop;
    setHeight(newHeight);
  }, []);

  const handleMouseMoveW = useCallback((e) => {
    const newWidth = e.clientX - document.body.offsetLeft;
    setWidth(newWidth);
  }, []);

  const handleMouseUpH = () => {
    document.removeEventListener('mouseup', handleMouseUpH, true);
    document.removeEventListener('mousemove', handleMouseMoveH, true);
  };

  const handleMouseDownH = () => {
    document.addEventListener('mouseup', handleMouseUpH, true);
    document.addEventListener('mousemove', handleMouseMoveH, true);
  };

  const handleMouseUpW = () => {
    document.removeEventListener('mouseup', handleMouseUpW, true);
    document.removeEventListener('mousemove', handleMouseMoveW, true);
  };

  const handleMouseDownW = () => {
    document.addEventListener('mouseup', handleMouseUpW, true);
    document.addEventListener('mousemove', handleMouseMoveW, true);
  };

  const selectScript = (name) => {
    setScript(exampleScripts.find((s) => s.name === name).code);
  };

  const runCommand = (type, code) => {
    secondScriptAux.current = '';
    setSecondScript('');
    if (type !== 'clear') socket.emit(type, code);
  };

  return (
    <div>
      <div style={{ display: 'flex', borderTop: '5px solid #002b36' }}>
        <CodeMirrorWrapper
          code={script}
          propCodeWidth={width}
          propCodeHeight={height}
          runCommand={(o, code) => runCommand(o, code)}
          locked={locked}
          isElixir
        />
        <div onMouseDown={(e) => handleMouseDownW(e)} className={styles['width-dragger']} />
        <CodeMirrorWrapper
          code={secondScript}
          propCodeWidth={window.innerWidth - width}
          propCodeHeight={height}
          withOptions={false}
          locked
          isElixir={isElixir}
        />
      </div>
      <div onMouseDown={(e) => handleMouseDownH(e)} className={styles['height-dragger']} />
      <Document
        addTab={(name) => selectScript(name)}
        propCodeHeight={window.innerHeight - height}
      />
    </div>
  );
}
