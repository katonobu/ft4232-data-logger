import { useState, useEffect } from 'react'
import './App.css'
import {HwAccessInit, HwAccess} from './HwAccessInit'

import SlideSwitch from './components/SlideSwitch'
import CheckIndicator from './components/CheckIndicator'
  
function App() {
  const [initSuccess, setInitSuccess] = useState<boolean>(false)
  const [disable, setDisable] = useState<boolean>(true)
  const [hwAccess, setHwAccess] = useState<HwAccess | null>(null)
  const [dispDebug, setDispDebut] = useState<boolean>(true)
  const [errMsg, setErrMsg] = useState<string[]>([])

  useEffect(()=>{
    setHwAccess(new HwAccess())
  },[])

  const targetCtrlDisable = !(initSuccess && !disable)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        maxWidth: '640px'
      }}
    >
      <div
        style={{
          padding: '32px'
        }}
      >
        <HwAccessInit
          setErrMsg={setErrMsg}
          hwAccess={hwAccess}
          disable={disable}
          setDisable={setDisable}
          initSuccess={initSuccess}
          setInitSuccess={setInitSuccess}
        />
      </div>
      <div
        style={{
          padding: '32px'
        }}
      >
        <div>
          {errMsg.map((msg, idx)=>(<pre key={idx.toString(10)} style={{ margin: '8px'}}>{msg}</pre>))}
        </div>
        <hr></hr>
        <label
            // このlabel要素内でクリックするとcheckboxのonChange()が呼ばれる
            htmlFor={'disp-debug'}
        >
          <input
            // width,heightともに0なので見えない
            type="checkbox"
            id={'disp-debug'}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                //              console.log(event.target.checked)
                setDispDebut(event.target.checked)
            }}
            checked={dispDebug}
          />
          View Debugging Info
        </label>                
        {dispDebug ? (
          <div>
            <SlideSwitch
              id={'hw-init'}
              checked={initSuccess}
              setChecked={setInitSuccess}
              checkedStr={"HW Init Success"}
              unCheckedStr={'HW not initialized'}
              transformDurationMs={10}
              checkedColor='blue'
              unCheckedBackgroundColor='rgb(208,208,208)'
            />
            <SlideSwitch
              id={'disable'}
              checked={disable}
              setChecked={setDisable}
              checkedStr={"Disabled"}
              unCheckedStr={'Enabled'}
              transformDurationMs={10}
              checkedColor='blue'
              unCheckedBackgroundColor='rgb(208,208,208)'
            />
            <CheckIndicator
              checked={targetCtrlDisable}
              checkedStr={"TargetCtrlDisable"}
              attackDurationMs={10}
              releaseDurationMs={10}
              checkedColor='blue'
              unCheckedColor='rgb(208,208,208)'
            />
          </div>
        ) :
          null
        }
      </div>
    </div>
  )
}

export default App
