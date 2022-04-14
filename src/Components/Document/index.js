import styles from './index.module.css'
import { scripts as exampleScripts } from '../../example-scripts'

export default function Document({ propCodeHeight, addTab }) {

  return (
    <div className={styles['wrapper']} style={{height:`${propCodeHeight}px`}}>
      <div className={styles['container']}>
        <h1>Elixir gradual typechecker</h1>
        <div className={styles['examples']}>
          <h4>list of examples</h4>
          <ul>
            {exampleScripts.map((s, i) => {
              return (
                <li onClick={() => addTab(s.name)} key={i}>{s.name}</li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}