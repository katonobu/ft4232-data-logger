import {CreHandler, sendCmdWaitRspType} from './creHandler'

export const resetByCmd = async (creHandler: CreHandler): Promise<void> => {
    // 先に待ち受けPromiseを作っておいてから
    const waitRstEvt = creHandler.waitEvt((evt) => evt.startsWith("| SYS RESET"), 1000)
    // リセットコマンドを打って
    console.log(await creHandler.sendCmdWaitRsp("< SYS RESET SET ON\r\n", null, 100))
    // リセットイベント待ちする
    console.log(JSON.stringify({ evt: await waitRstEvt }))
    await creHandler.sendCmdWaitRsp("< SYS MODE SET 0\r\n", null, 5 * 1000)
}

export const initCmds = async (
    creHandler: CreHandler,
    setSysVer: (stt: sendCmdWaitRspType | null) => void,
    setSysMode: (stt: sendCmdWaitRspType | null) => void,
    setGnssVer: (stt: sendCmdWaitRspType | null) => void,
    setGnssHostFwSent: (stt: sendCmdWaitRspType | null) => void,
): Promise<void> => {
    setSysVer(await creHandler.sendCmdWaitRsp("< SYS VER GET\r\n", null, 100))
    setGnssVer(await creHandler.sendCmdWaitRsp("< GNSS VER GET\r\n", null, 100))
    setSysMode(await creHandler.sendCmdWaitRsp("< SYS MODE GET\r\n", null, 5 * 1000))
    await creHandler.sendCmdWaitRsp("< SYS STT SET_EVT ON\r\n", null, 100)
    await creHandler.sendCmdWaitRsp("< GNSS STT SET_EVT ON\r\n", null, 100)
    //  setGnssHostFwSent(await creHandler.sendCmdWaitRsp("< GNSS HOST_FW_SENT SET_EVT FFFFFFFF\r\n", null, 100))
    setGnssHostFwSent(await creHandler.sendCmdWaitRsp("< GNSS HOST_FW_SENT SET_EVT 0xC00000A0\r\n", null, 100))
}
