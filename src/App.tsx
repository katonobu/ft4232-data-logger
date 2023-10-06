import { useState, useEffect } from 'react'
import './App.css'
import { HwAccess } from './control/HwAccess'
import { HwAccessInitButton } from './components/HwAccessInitButton'
import { HwAccessFt4232 } from './control/HwAccessFt4232'
import {CreHandler} from './control/creHandler'
import {sendCmdWaitRspType} from './control/creHandler'
import {GnssHostFwSentPre, GnssSttPre, GnssVerPre, GnssSttDotsEnum} from './components/Gnss'
import {SysVerPre, SysModePre, SysSttPre, SysSttIndicator} from './components/Sys'
import {SysSttStrType} from './hooks/useSys'
import {ErrorMessagePre} from './components/ErrorMsg'
import { DispDebugSelect } from './components/DispDebugSelect'

import {useNmeaRxSentences, useNmeaSingleLineAnalyseSentence} from './hooks/useNmea'
import {NmeaSentencesPre, ZdaView, RmcView} from './components/Nmea'
import {ResetInitButton, InitButton} from './components/ResetInitButton'


const sysSttColorTbl:Record<SysSttStrType,string> = {
  "IDLE":"gray",// スタンバイ状態：電源 ON 直後
  "FETCHING_TIME":"rgb(219, 234, 254)",//  からの送信パラメータ設定（時刻取得中）
  "WAIT_FETCHING_TIME":"gray",//  GNSS 受信再開待ち（時刻取得処理を中断）
  "EPM_FILL":"rgb(219, 234, 254)",//  エフェメリス取得
  "WAIT_TX_PREPARE":"blue",//  送信準備待ち
  "AF_TX_PREPARE":"blue",//  AR フレーム送信準備中
  "AF_WAIT_TX_START":"blue",//  AR フレーム送信待機中
  "AF_TX_PROGRESS":"blue",//  AR フレーム送信中
  "DF_TX_PREPARE":"blue",//  データフレーム送信準備中
  "DF_WAIT_TX_START":"blue",//  データフレーム送信待機中
  "DF_TX_PROGRESS":"blue",//  データフレーム送信中 
  "EV_TX_COMPLETE":"blue",//  EVENT 送信プロファイル時、規定回数送信完了
  "GNSS_BACKUP":"gray",//  エフェメリスバックアップ中
  "GNSS_BACKUP_DONE":"gray",//  エフェメリスバックアップ終了
  "NotAvailable":"black"
}

export const analyseSentences:string[] = [
  '$PSPRA',
  '$GPGGA',
  '$GNGLL',
  '$GNGSA',
  '$GNGNS',
  '$GNRMC',
  '$GPRMC',
  '$GNVTG',
  '$GNZDA',
  '$GPZDA',
  '$PSGSA',
  '$PSGES',
  '$PSLES',
  '$PSZDA',
  '$PSEPU',
  '$PSEND',
]

function App() {
  const [initSuccess, setInitSuccess] = useState<boolean>(false)
  const [disable, setDisable] = useState<boolean>(true)
  const [hwAccess, setHwAccess] = useState<HwAccess | null>(null)
  const [creHandler, setCreHandler] = useState<CreHandler | null>(null)
  const [dispDebug, setDispDebug] = useState<boolean>(true)
  const [errMsg, setErrMsg] = useState<string[]>([])

  const [sysVer, setSysVer] = useState<sendCmdWaitRspType | null>(null)
  const [sysMode, setSysMode] = useState<sendCmdWaitRspType | null>(null)
  const [gnssVer, setGnssVer] = useState<sendCmdWaitRspType | null>(null)
  const [gnssHostFwSent, setGnssHostFwSent] = useState<sendCmdWaitRspType | null>(null)

  const sentences = useNmeaRxSentences(creHandler, analyseSentences)
  const sentenceInfos = useNmeaSingleLineAnalyseSentence(sentences, analyseSentences)

  useEffect(() => {
    setHwAccess(new HwAccessFt4232(setInitSuccess, setCreHandler))
  }, [])

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
        <HwAccessInitButton
          setErrMsg={setErrMsg}
          hwAccess={hwAccess}
          disable={disable}
          setDisable={setDisable}
          initSuccess={initSuccess}
          setInitSuccess={setInitSuccess}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <ResetInitButton
            creHandler = {creHandler}
            setDisable = {setDisable}
            setSysVer = {setSysVer}
            setSysMode = {setSysMode}
            setGnssVer = {setGnssVer}
            setGnssHostFwSent = {setGnssHostFwSent}
            targetCtrlDisable = {targetCtrlDisable}
          />
          <InitButton
            creHandler = {creHandler}
            setDisable = {setDisable}
            setSysVer = {setSysVer}
            setSysMode = {setSysMode}
            setGnssVer = {setGnssVer}
            setGnssHostFwSent = {setGnssHostFwSent}
            targetCtrlDisable = {targetCtrlDisable}
          />
        </div>
        <div>
            <SysSttIndicator creHandler={creHandler} colorTbl={sysSttColorTbl}></SysSttIndicator>
            <GnssSttDotsEnum creHandler={creHandler}></GnssSttDotsEnum>
            <ZdaView sentenceInfos={sentenceInfos}></ZdaView>
            <RmcView sentenceInfos={sentenceInfos}></RmcView>
        </div>
       
      </div>

      <div
        style={{
          padding: '32px'
        }}
      >
        <ErrorMessagePre errMsgs = {errMsg}></ErrorMessagePre>
        <hr></hr>
        <DispDebugSelect setDispDebug={setDispDebug} dispDebug={dispDebug} />
        {dispDebug ? (
          <div>
            <SysVerPre sysVer={sysVer}></SysVerPre>
            <SysModePre sysMode={sysMode}></SysModePre>
            <SysSttPre creHandler={creHandler}></SysSttPre>
            <hr></hr>
            <GnssVerPre gnssVer={gnssVer}></GnssVerPre>
            <GnssSttPre creHandler = {creHandler}></GnssSttPre>
            <hr></hr>
            <GnssHostFwSentPre gnssHostFwSent={gnssHostFwSent}></GnssHostFwSentPre>
            <NmeaSentencesPre sentenceInfos={sentenceInfos}/>
          </div>
        ) :
          null
        }
      </div>
    </div>
  )
}

export default App

/*
        <div
          style={{backgroundColor:'#f8f8f8', minHeight:"200px", flexGrow:1}}
        >
          hogehoge
        </div>

*/