import { useState, useEffect } from 'react'
import { CreHandler, sendCmdWaitRspType } from '../control/creHandler'
import { useGnssStt, gnssSttStrToEnumStr } from '../hooks/useGnss'

export const GnssVerPre = (props: { gnssVer: sendCmdWaitRspType | null }) => {
    const { gnssVer } = props

    const gnssVerStr = (() => {
        if (gnssVer === null) {
            return "00000,0000000,000 0x00000000 0x00000000"
        } else if (gnssVer.rsp) {
            return gnssVer.rsp.split(' ').slice(4).join(' ')
        }
    })()
    return <pre>{"GNSS VER : " + gnssVerStr}</pre>

}

export const GnssHostFwSentPre = (props: { gnssHostFwSent: sendCmdWaitRspType | null }) => {
    const { gnssHostFwSent } = props

    const gnssHostFwSentStr = (() => {
        if (gnssHostFwSent === null) {
            return "Not available"
        } else if (gnssHostFwSent.rsp && gnssHostFwSent.rsp.split(' ')[4] === "OK" && gnssHostFwSent.cmd) {
            return gnssHostFwSent.cmd.split(' ')[4].toString()
        }
    })()
    return <pre>{"GNSS HOST FW SENT : " + gnssHostFwSentStr}</pre>
}

export const GnssSttPre = (props: { creHandler: CreHandler | null }) => {
    const { creHandler } = props
    const [gnssStt, setGnssStt] = useState<string | null>(null)
    useEffect(() => {
        if (creHandler) {
            creHandler.subscribeEvt((evt: string) => {
                if (evt.startsWith("| GNSS STT")) {
                    setGnssStt(evt.split(' ')[3])
                }
            })
        } else {
            setGnssStt("NotAvailable")
        }
    }, [creHandler])
    return <pre>{"GNSS STT : " + gnssStt}</pre>
}

const GnssSttDots = (props: { gnssSttStr: string }) => {
    const { gnssSttStr } = props
    let gnssVal = parseInt(gnssSttStr, 16)
    if (isNaN(gnssVal)) {
        gnssVal = 0
    }
    return (
        <>{
            [7, 6, 5, 4, 3, 2, 1, 0].map((bitPos) => (
                <div
                    key={bitPos.toString(10)}
                    style={{
                        top: '2px',
                        left: '2px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '4px',
                        // checke状態に応じて色を変える
                        backgroundColor: (((1 << bitPos) & gnssVal) !== 0) ? 'blue' : "rgb(219, 234, 254)",
                        transition: '100',
                    }}
                />
            ))
        }</>
    )
}

export const GnssSttDotsEnum = (props: { creHandler: CreHandler | null }) => {
    const { creHandler } = props
    const gnssStt = useGnssStt(creHandler) ?? "NotAvailable"
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <GnssSttDots
                gnssSttStr={gnssStt}
            />
            <span
                style={{ marginLeft: '4px' }}
            >{"GNSS.STT : " + gnssSttStrToEnumStr(gnssStt)}</span>
        </div>
    )
}
