import { useState } from 'react'
import SlideSwitch from './components/SlideSwitch'

enum resetSequenceEnum {
    Normal,
    NormalLong,
    FwUpdate,
    FwUpdateLong,
}

const setHwAndEnablePortStt = async (
    stt: boolean,
    hwAccess: HwAccess | null,
    setEnablePortStt: (stt: boolean) => void,
    setErrMsg: (msgs:string[]) => void
): Promise<boolean> => {
    let ret = false
    if (hwAccess) {
        try {
            if (await hwAccess.setResetPort(stt)) {
                setEnablePortStt(stt)
                ret = true
            } else {
                setErrMsg(["Fail to hwAccess.setResetPort(stt)"])
            }
        } catch (e) {
            if (e instanceof Error) {
                const errorMessage: string = e.message;
                setErrMsg([errorMessage])
            } else {
                setErrMsg(["Unknown Error"])
            }            
        }
    } else {
        setErrMsg(["hwAccess is falsy"])
    }
    return ret
}

const setHwAndSleepPortStt = async (
    stt: boolean,
    hwAccess: HwAccess | null,
    setSleepPortStt: (stt: boolean) => void,
    setErrMsg: (msgs:string[]) => void
): Promise<boolean> => {
    let ret = false
    if (hwAccess) {
        try {
            if (await hwAccess.setSleepPort(stt)) {
                setSleepPortStt(stt)
            } else {
                setErrMsg(["Fail to hwAccess.setSleepPort(stt)"])
            }
        } catch (e) {
            if (e instanceof Error) {
                const errorMessage: string = e.message;
                setErrMsg([errorMessage])
            } else {
                setErrMsg(["Unknown Error"])
            }            
        }
    } else {
        setErrMsg(["hwAccess is falsy"])
    }
    return ret
}


export class HwAccess {
    constructor() {
    }
    async init(
        // @ts-ignore
        option: any
    ): Promise<boolean> {
        console.log("init()")
        await new Promise<void>((resolve) => setTimeout(resolve, 1500))
        return true
    }
    async setResetPort(stt: boolean): Promise<boolean> {
        console.log(`setResetPort(${stt})`)
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 10))
        return true
    }
    async setSleepPort(stt: boolean): Promise<boolean> {
        console.log(`setSleepPort(${stt})`)
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 10))
        return true
    }
    async finalize(): Promise<void> {
        console.log(`finalize()`)
        await new Promise<void>((resolve) => setTimeout(resolve, 10))
    }
}

const execResetSequence = async (
    hwAccess: HwAccess | null,
    sequenceType: resetSequenceEnum,
    setEnablePortStt: (stt: boolean) => void,
    setSleepPortStt: (stt: boolean) => void,
    setDisable: (stt: boolean) => void,
    setErrMsg: (msgs:string[]) => void
) => {
    if (hwAccess) {
        try {
            setDisable(true)
            const reestDuration = (sequenceType === resetSequenceEnum.NormalLong || sequenceType === resetSequenceEnum.FwUpdateLong) ? 1000 : 500
            setHwAndEnablePortStt(false, hwAccess, setEnablePortStt,setErrMsg)
            if (
                sequenceType === resetSequenceEnum.FwUpdateLong ||
                sequenceType === resetSequenceEnum.FwUpdate
            ) {
                setHwAndSleepPortStt(true, hwAccess, setSleepPortStt,setErrMsg)
            } else {
                setHwAndSleepPortStt(false, hwAccess, setSleepPortStt,setErrMsg)
            }
            await new Promise<void>((resolve) => setTimeout(resolve, 300))
            setHwAndEnablePortStt(true, hwAccess, setEnablePortStt,setErrMsg)
            await new Promise<void>((resolve) => setTimeout(resolve, reestDuration))
            setHwAndEnablePortStt(false, hwAccess, setEnablePortStt,setErrMsg)
        } catch (e) {
            if (e instanceof Error) {
                const errorMessage: string = e.message;
                setErrMsg([errorMessage])
            } else {
                setErrMsg(["Unknown Error"])
            }            
        } finally {
            setDisable(false)
        }
    } else {
        setErrMsg(["hwAccess is null"])
    }
}

export const HwAccessInit = (props: {
    setErrMsg:(msgs:string[])=>void,
    hwAccess: HwAccess | null,
    disable: boolean,
    setDisable: (stt: boolean) => void,
    initSuccess: boolean,
    setInitSuccess: (stt: boolean) => void,
    setEnablePortStt: (stt: boolean) => void,
    setSleepPortStt: (stt: boolean) => void,
    option?: any
}) => {
    const {
        setErrMsg,
        hwAccess,
        disable,
        setDisable,
        initSuccess,
        setInitSuccess,
        setEnablePortStt,
        setSleepPortStt,
        option = {}
    } = props
    const [initDisabled, setInitDisabled] = useState<boolean>(false)
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <button
                disabled={!(
                    (!initSuccess && !initDisabled) ||
                    (initSuccess && !disable)
                )}
                onClick={async () => {
                    if (hwAccess) {
                        setInitDisabled(true)
                        setDisable(true)
                        try {
                            const result = await hwAccess.init(option)
                            setInitSuccess(result)
                            setDisable(!result)
                            if (result) {
                                setHwAndEnablePortStt(false, hwAccess, setEnablePortStt,setErrMsg)
                                setHwAndSleepPortStt(false, hwAccess, setSleepPortStt,setErrMsg)
                            }
                        } catch(e) {
                            setInitSuccess(false)
                            setDisable(true)
                            if (e instanceof Error) {
                                const errorMessage: string = e.message;
                                setErrMsg([errorMessage])
                            } else {
                                setErrMsg(["Unknown Error"])
                            }            
                        }
                        setInitDisabled(false)
                    }
                }}
                style={{
                    width: '8em',
                    height: '3em',
                    margin: '8px',
                }}
            >
                Access Init
            </button>
        </div>
    )
}
export const HwReset = (props: {
    setErrMsg:(msgs:string[])=>void,
    hwAccess: HwAccess | null,
    disable: boolean,
    setDisable: (stt: boolean) => void,
    enablePortStt: boolean,
    setEnablePortStt: (stt: boolean) => void,
    sleepPortStt: boolean,
    setSleepPortStt: (stt: boolean) => void,
}) => {
    const {
        setErrMsg,
        hwAccess,
        disable,
        setDisable,
        enablePortStt,
        setEnablePortStt,
        sleepPortStt,
        setSleepPortStt,
    } = props
    return (
        <>
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <button
                        onClick={() => execResetSequence(hwAccess, resetSequenceEnum.NormalLong, setEnablePortStt, setSleepPortStt, setDisable, setErrMsg)}
                        disabled={disable}
                        style={{
                            width: '8em',
                            height: '3em',
                            margin: '8px',
                        }}
                    >
                        Normal RESET
                    </button>
                    <button
                        onClick={() => execResetSequence(hwAccess, resetSequenceEnum.FwUpdateLong, setEnablePortStt, setSleepPortStt, setDisable, setErrMsg)}
                        disabled={disable}
                        style={{
                            width: '8em',
                            height: '3em',
                            margin: '8px',
                        }}
                    >
                        FW Update RESET
                    </button>
                </div>
                <div>
                    <div
                        style={{
                            margin: '8px'
                        }}
                    >
                        <SlideSwitch
                            disabled={disable}
                            id={'reset'}
                            checked={enablePortStt}
                            setChecked={async (stt: boolean) => {
                                setHwAndEnablePortStt(stt, hwAccess, setEnablePortStt,setErrMsg)
                            }}
                            checkedStr={"Resetting"}
                            unCheckedStr={'Reset Released'}
                            transformDurationMs={500}
                            checkedColor='blue'
                            unCheckedBackgroundColor='rgb(208,208,208)'
                        />
                    </div>
                    <div
                        style={{
                            margin: '8px'
                        }}
                    >
                        <SlideSwitch
                            disabled={disable}
                            id={'sleep'}
                            checked={sleepPortStt}
                            setChecked={async (stt: boolean) => {
                                setHwAndSleepPortStt(stt, hwAccess, setSleepPortStt,setErrMsg)
                            }}
                            checkedStr={"FW Update"}
                            unCheckedStr={'Normal Reset'}
                            transformDurationMs={500}
                            checkedColor='blue'
                            unCheckedBackgroundColor='rgb(208,208,208)'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
