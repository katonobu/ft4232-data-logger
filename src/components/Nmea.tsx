import {sentenceInfoType, extractZdaString, dmLocToD} from '../hooks/useNmea'


export const NmeaSentencesPre = (props: { sentenceInfos: sentenceInfoType[] }) => {
    const { sentenceInfos } = props
    return (
        <>{
            sentenceInfos.map((sen, idx)=>(
                <pre key={idx.toString(10)}>{sen.sentence}</pre>
            ))
        }</>
    )
}

export const ZdaView = (props: { sentenceInfos: sentenceInfoType[] }) => {
    const { sentenceInfos } = props
    let zda = sentenceInfos.find((si) => si.name === '$GNZDA')
    if (zda === undefined || zda.sentence === '') {
        zda = sentenceInfos.find((si) => si.name === '$GPZDA')
    }
    const dateTime = extractZdaString(zda)
    const sec = dateTime.getSeconds()
    let bgColor = ''
    let fontColor = '#213547'

    if(2000 < dateTime.getFullYear()){
        if ((sec % 2) === 0) {
            bgColor = "rgb(219, 234, 254)"
        } else {
            bgColor = 'aqua'
        }
    } else {
        if ((sec % 2) === 0) {
            bgColor = 'gray'
            fontColor = 'white'
        } else {
            bgColor = 'silver'
        }
    }

    return (
        <div
            style={{
                fontSize: '24px',
                textAlign: 'center',
                margin: '4px'
            }}
        >
            <span
                style={{
                    padding: '4px',
                    backgroundColor: bgColor,
                    color: fontColor,
                    borderRadius: '4px'
                }}
            >
                {dateTime.toLocaleString()}
            </span>
        </div>
    )
}

export const RmcView = (props: { sentenceInfos: sentenceInfoType[] }) => {
    const { sentenceInfos } = props
    let rmc = sentenceInfos.find((si) => si.name === '$GNRMC')
    if (rmc === undefined || rmc.sentence === '') {
        rmc = sentenceInfos.find((si) => si.name === '$GPRMC')
    }
    if (rmc) {
        const splitted = rmc.sentence.split(",")
        const lat = dmLocToD(splitted[3], splitted[4] === 'S')
        const lon = dmLocToD(splitted[5], splitted[6] === 'W')
        if (isNaN(lat) || isNaN(lon)) {
            return <div></div>
        } else {
            return <div>{lat.toFixed(6) + " " + lon.toFixed(6)}</div>
        }
    }
    return <div></div>
}

