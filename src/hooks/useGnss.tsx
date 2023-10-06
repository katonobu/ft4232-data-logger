import {useState, useEffect} from 'react'
import {CreHandler} from '../control/creHandler'

export const useGnssStt = (creHandler:CreHandler|null) => {
    const [gnssStt, setGnssStt] = useState<string | null>(null)
    useEffect(()=>{
        if (creHandler) {
            creHandler.subscribeEvt((evt:string)=>{
                if (evt.startsWith("| GNSS STT")) {
                    setGnssStt(evt.split(' ')[3])
                }
            })
        } else {
            setGnssStt("NotAvailable")     
        }
    },[creHandler])
    return gnssStt
}

/*
Bit0 GNSS 受信動作中
Bit1 時刻取得済み
Bit2 測位状態
Bit3 品質測位指標 TH0 GSV の CN 値が 25 以上の衛星数が 3 以上 PDOP が 5 以下
Bit4 品質測位指標 TH1 GSV の CN 値が 30 以上の衛星数が 4 以上 PDOP が 4 以下
Bit5 時刻高精度状態
Bit6 －
Bit7 Sleep 中
*/
enum GnssSttEnum {
    GNSS_SLEEP,
    GNSS_IDLE,
    GNSS_RX,
    GNSS_GOT_TIME,
    GNSS_FIXED,
    GNSS_LOW_QUALITY,
    GNSS_HIGH_QUALITY,
    GNSS_HIGH_TIME_ACCURACY,
    GNSS_NOT_AVAILABLE
}

const gnssSttToEnum = (gnssStt: string) => {
    let ret = GnssSttEnum.GNSS_NOT_AVAILABLE
    const value = parseInt(gnssStt, 16)
    if (value & 0x80) {
        ret = GnssSttEnum.GNSS_SLEEP
    } else if (value === 0) {
        ret = GnssSttEnum.GNSS_IDLE
    } else if (value & 0x20) {
        ret = GnssSttEnum.GNSS_HIGH_TIME_ACCURACY
    } else if (value & 0x10) {
        ret = GnssSttEnum.GNSS_HIGH_QUALITY
    } else if (value & 0x08) {
        ret = GnssSttEnum.GNSS_LOW_QUALITY
    } else if (value & 0x04) {
        ret = GnssSttEnum.GNSS_FIXED
    } else if (value & 0x02) {
        ret = GnssSttEnum.GNSS_GOT_TIME
    } else if (value & 0x01) {
        ret = GnssSttEnum.GNSS_RX
    }
    return ret
}

const gnssEnumStrTable = [
    "GNSS_SLEEP",
    "GNSS_IDLE",
    "GNSS_RX",
    "GNSS_GOT_TIME",
    "GNSS_FIXED",
    "GNSS_LOW_QUALITY",
    "GNSS_HIGH_QUALITY",
    "GNSS_HIGH_TIME_ACCURACY",
    "GNSS_NOT_AVAILABLE"
]

export const gnssSttStrToEnumStr = (gnssSttStr: string) => {
    const gnssEnum = gnssSttToEnum(gnssSttStr)
    return gnssEnumStrTable[gnssEnum]
}
