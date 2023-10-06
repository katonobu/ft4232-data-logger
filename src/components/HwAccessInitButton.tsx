import { useState } from 'react'
import { HwAccess } from '../control/HwAccess'

export const HwAccessInitButton = (props: {
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
