import { useState } from 'react'

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

export const HwAccessInit = (props: {
    setErrMsg:(msgs:string[])=>void,
    hwAccess: HwAccess | null,
    disable: boolean,
    setDisable: (stt: boolean) => void,
    initSuccess: boolean,
    setInitSuccess: (stt: boolean) => void,
    option?: any
}) => {
    const {
        setErrMsg,
        hwAccess,
        disable,
        setDisable,
        initSuccess,
        setInitSuccess,
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
                                // ここで空行打ってレスポンスチェック
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
