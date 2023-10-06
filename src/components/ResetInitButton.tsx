import {CreHandler, sendCmdWaitRspType} from '../control/creHandler'
import { resetByCmd, initCmds } from '../control/controlSequence'


export const ResetInitButton = (props:{
    creHandler:CreHandler | null,
    setDisable:(stt:boolean)=>void,
    setSysVer:(stt:sendCmdWaitRspType | null)=>void,
    setSysMode:(stt:sendCmdWaitRspType | null)=>void,
    setGnssVer:(stt:sendCmdWaitRspType | null)=>void,
    setGnssHostFwSent:(stt:sendCmdWaitRspType | null)=>void,
    targetCtrlDisable:boolean
}) => {
    const {creHandler, setDisable, setSysVer, setSysMode, setGnssVer, setGnssHostFwSent, targetCtrlDisable} = props
    return (
        <button
            onClick={async () => {
                if (creHandler) {
                    setDisable(true)
                    await resetByCmd(creHandler)
                    await initCmds(creHandler, setSysVer, setSysMode, setGnssVer, setGnssHostFwSent)
                    setDisable(false)
                }
            }}
            disabled={targetCtrlDisable}
            style={{
                width: '8em',
                height: '3em',
                margin: '8px',
            }}
        >
            RESET/INIT
        </button>

    )
}

export const InitButton = (props:{
    creHandler:CreHandler | null,
    setDisable:(stt:boolean)=>void,
    setSysVer:(stt:sendCmdWaitRspType | null)=>void,
    setSysMode:(stt:sendCmdWaitRspType | null)=>void,
    setGnssVer:(stt:sendCmdWaitRspType | null)=>void,
    setGnssHostFwSent:(stt:sendCmdWaitRspType | null)=>void,
    targetCtrlDisable:boolean
}) => {
    const {creHandler, setDisable, setSysVer, setSysMode, setGnssVer, setGnssHostFwSent, targetCtrlDisable} = props
    return (
        <button
            onClick={async () => {
                if (creHandler) {
                    setDisable(true)
                    await initCmds(creHandler, setSysVer, setSysMode, setGnssVer, setGnssHostFwSent)
                    setDisable(false)
                }
            }}
            disabled={targetCtrlDisable}
            style={{
                width: '8em',
                height: '3em',
                margin: '8px',
            }}
        >
            INIT
        </button>

    )
}

