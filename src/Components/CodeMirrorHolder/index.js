import CodeMirror from '../CodeMirror';
import { useState, useCallback, useEffect } from 'react';
import styles from './index.module.css'
import scripts from '../../preloaded-scripts.json'

const minDrawerWidth = 50;
const maxDrawerWidth = 1000;
const minDrawerHeight = 50;
const maxDrawerHeight = 1000;

export default function Holder() {
  const [width, setWidth] = useState(window.innerWidth/2)
  const [height, setHeight] = useState(window.innerHeight/2)

  const handleResize = () => {
    setWidth(window.innerWidth/2)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  })

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

  return (
    <div>
      <div style={{display: 'flex'}}>
        <CodeMirror scripts={scripts} propCodeWidth={width} propCodeHeight={height} />
        <div onMouseDown={e => handleMouseDownW(e)} className={styles['width-dragger']} />
        <CodeMirror scripts={scripts} propCodeWidth={window.innerWidth - width} propCodeHeight={height} />
      </div>
      <div onMouseDown={e => handleMouseDownH(e)} className={styles['height-dragger']} />
    </div>
  );
}