import {CreHandler, sendCmdWaitRspType} from '../control/creHandler'
import CheckIndicator from './CheckIndicator'
import {useSysStt, SysSttStrType} from '../hooks/useSys'

export const SysVerPre = (props:{sysVer:sendCmdWaitRspType | null})=>{
    const {sysVer} = props
    const sysVerStr = (()=>{
        if (sysVer===null) {
            return "000000000000000000000000 XX0000 00000000 Xxx 00 0000 00:00:00"
        } else if (sysVer.rsp) {
            return sysVer.rsp.split(' ').slice(4).join(' ')
        }
    })()
    return <pre>{"SYS VER : " + sysVerStr}</pre>
}


export const SysModePre = (props:{sysMode:sendCmdWaitRspType | null})=>{
    const {sysMode} = props
    const sysModeStr = (()=>{
        if (sysMode===null) {
            return "Not available"
        } else if (sysMode.rsp) {
            return parseInt(sysMode.rsp.split(' ')[4], 10).toString(10)
        }
    })()
    return <pre>{"SYS MODE : " + sysModeStr}</pre>
}

export const SysSttPre = (props:{creHandler:CreHandler|null})=>{
    const {creHandler} = props
    const sysStt = useSysStt(creHandler) ?? "NotAvailable"
    return <pre>{"SYS STT : " + sysStt}</pre>
}

export const SysSttIndicator = (props:{
    creHandler:CreHandler|null,
    colorTbl:Record<SysSttStrType,string>
})=>{
  const {
    creHandler,
    colorTbl
} = props
  const sysStt = useSysStt(creHandler) ?? "NotAvailable"
  const color = sysStt in colorTbl?colorTbl[sysStt]:'black'
  return (
    <CheckIndicator
      checked={true}
      checkedStr={"SYS.STT : "+sysStt}
      attackDurationMs={10}
      releaseDurationMs={10}
      checkedColor={color}
    />
  )
}
