import {HwAccess} from './HwAccess'
import JsSerialWeb from '@katonobu/js-serial-web';
import {CreHandler} from './creHandler'

const grantAccessOption = {"filters":[{"usbVendorId": 0x0403, "usbProductId": 0x6011 }] }

export class HwAccessFt4232 extends HwAccess {
    private readonly jsw:JsSerialWeb
    private readonly setInitSuccess:(stt:boolean)=>void
    private currentUsingPortId:number
    private unsubscribeRxLineNum:(arg:void)=>void
    private creHandler:CreHandler|null
    private setCreHandler:(stt:CreHandler|null)=>void
    private lastUnknownRxStr:string
    constructor(
        setInitSuccess:(stt:boolean)=>void,
        setCreHandler:(stt:CreHandler|null)=>void
    ){
        super()
        this.setInitSuccess = setInitSuccess
        this.jsw = new JsSerialWeb()
        this.jsw.init()
        this.currentUsingPortId = -1
        this.unsubscribeRxLineNum = ()=>{}
        this.setCreHandler = setCreHandler
        this.creHandler = null
        this.lastUnknownRxStr = ""
    }
    async init(
        // @ts-ignore
        option:any
    ):Promise<boolean> {
//        console.log("Ft4232Init()")
        // WebSerialが使えない?
        if (!('serial' in navigator)){
            throw( new Error("This device is not support WebSerial-API."))
        // すでにOpenされている?
        } else if (0 <= this.currentUsingPortId) {
            return true
        } else {
            let ports = this.jsw.getPorts()
            console.log(ports)
            // 1つもポートアクセス許可されたポートがつながっていない?
            if (ports.curr.filter((p:any)=>p.available).length === 0) {
                // ポートアクセス許可を取得
//                console.log("ports.curr.length === 0, invoke grantAccess()")
                // @ts-ignore
                const gaResult = await this.jsw.promptGrantAccess(grantAccessOption)
//                console.log(gaResult)
            }
            // 再度有効ポート数を確認
            ports = this.jsw.getPorts()
            const availablePorts = ports.curr.filter((p:any)=>p.available)
            // アクセス許可されていてつながっているポートが1つ?
            if (availablePorts.length === 1) {
                const portId = availablePorts[0].id
                console.log(`ports.curr.length === 1, try to openPort(${portId})`)
                const unsubscribe = this.jsw.subscribeOpenStt(portId, ()=>{
                    const portOpenStt = this.jsw.getOpenStt(portId)
                    // portがOpenした?
                    if(portOpenStt === true){
                        // Port Open時の処理
                        this.jsw.startReceivePort(portId) // バックグラウンド受信処理開始:重要！
                        const creHandler = new CreHandler((dataToSend:string)=>{
                            const textEncoder = new TextEncoder()
                            return this.jsw.sendPort(portId, textEncoder.encode(dataToSend))
                        })
                        this.unsubscribeRxLineNum = this.jsw.subscribeRxLineNum(portId, ()=>{
                            const rxLines = this.jsw.getRxLineNum(portId).addedLines
//                            console.log(JSON.stringify(rxLines))
                            rxLines.forEach(({data}:{data:string})=>{
                                if (data.startsWith("> ")) {
//                                    console.log(" RSP", data.replace("\r",""))
                                    creHandler.updateRsp(data.replace("\r",""))
                                } else if (data.startsWith("| ")) {
//                                    console.log(" EVT", data.replace("\r",""))
                                    creHandler.updateEvt(data.replace("\r",""))
                                } else {
//                                    console.log(" ???", data.replace("\r",""))
                                }
                            })
                        })
                        this.creHandler = creHandler
                        this.setCreHandler(this.creHandler)
                    // portがCloseした?
                    } else {
                        // Port Close時の処理
                        this.unsubscribeRxLineNum()

                        this.setInitSuccess(false)
                        this.currentUsingPortId = -1                    
                        unsubscribe()
                        this.creHandler = null
                        this.setCreHandler(this.creHandler)
                    }
                })
                // ポートオープン実行
                try {
                    const result = await this.jsw.openPort(portId, {
                        serialOpenOptions:{
                            baudRate:115200,
                            flowControl:'hardware' // データ系ポートはHW Flow制御必須
                        }
                    })
//                    console.log(`Open target port:${portId} ${result}`)
                    if (result === "OK") {
                        if (this.creHandler) {
                            try {
                                // 空行を送ってエラーレスポンスが返るのを確認する
                                this.lastUnknownRxStr = ""
                                const creResult = await this.creHandler.sendCmdWaitRsp("\r\n", null, 100)
                                if (creResult.rsp === "> Error!!! Invalid Input") {
                                    this.currentUsingPortId = portId
                                    return true
                                } else {
                                    this.jsw.closePort(portId)
                                    return false
                                }
                            } catch(e) {
                                // タイムアウト発生?
                                if (e instanceof Error && e.message.startsWith("timeout:")) {
                                    // 頭にゴミが乗っていた?
                                    if (this.lastUnknownRxStr.endsWith("> Error!!! Invalid Input\r")) {
                                        // 再度確認
                                        this.lastUnknownRxStr = ""
                                        try {
                                            const creResult = await this.creHandler.sendCmdWaitRsp("\r\n", null, 100)
                                            if (creResult.rsp === "> Error!!! Invalid Input") {
                                                this.currentUsingPortId = portId
                                                return true
                                            } else {
                                                this.jsw.closePort(portId)
                                                return false
                                            }
                                        } catch(e) {
                                            this.jsw.closePort(portId)
                                            return false
                                        }
                                    } else {
                                        this.jsw.closePort(portId)
                                        return false
                                    }
                                } else {
                                    this.jsw.closePort(portId)
                                    return false
                                }
                            }
                        }
                    } else {
                        return false
                    }
                } catch(e) {
                    // 例外はthrowされないはず
                    console.error(e)
                    return false
                }
            } else {
                console.warn(`availablePorts.length === ${availablePorts.length} !== 1`)
                return false
            }
        }
        return false
    }
    async finalize():Promise<void> {
    }
}

