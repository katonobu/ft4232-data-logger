import {useState, useEffect} from 'react'
import {CreHandler} from '../control/creHandler'

export type SysSttStrType = 
  "IDLE" | // スタンバイ状態：電源 ON 直後
  "FETCHING_TIME" | //   GNSSからの送信パラメータ設定（時刻取得中）
  "WAIT_FETCHING_TIME" | //  GNSS 受信再開待ち（時刻取得処理を中断）
  "EPM_FILL" | //  エフェメリス取得
  "WAIT_TX_PREPARE" | //  送信準備待ち
  "AF_TX_PREPARE" | //  AR フレーム送信準備中
  "AF_WAIT_TX_START" | //  AR フレーム送信待機中
  "AF_TX_PROGRESS" | //  AR フレーム送信中
  "DF_TX_PREPARE" | //  データフレーム送信準備中
  "DF_WAIT_TX_START" | //  データフレーム送信待機中
  "DF_TX_PROGRESS" | //  データフレーム送信中 
  "EV_TX_COMPLETE" | //  EVENT 送信プロファイル時、規定回数送信完了
  "GNSS_BACKUP" | //  エフェメリスバックアップ中
  "GNSS_BACKUP_DONE" | //  エフェメリスバックアップ終了
  "NotAvailable"

export const useSysStt = (creHandler:CreHandler|null):SysSttStrType => {
    const [sysStt, setSysStt] = useState<SysSttStrType>("NotAvailable")
    useEffect(()=>{
        if (creHandler) {
            creHandler.subscribeEvt((evt:string)=>{
                if (evt.startsWith("| SYS STT")) {
                    setSysStt(evt.split(' ')[3] as SysSttStrType)
                }
            })
        } else {
            setSysStt("NotAvailable")     
        }
    },[creHandler])
    return sysStt
}
