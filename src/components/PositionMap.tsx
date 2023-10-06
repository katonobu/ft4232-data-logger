import { useMemo, useState, useEffect } from 'react'
import {sentenceInfoType, dmLocToD} from '../hooks/useNmea'
import { MapContainer, TileLayer, Marker,LayersControl, Popup } from 'react-leaflet'

const UpdatePosByRmc = (props: {
    sentenceInfos: sentenceInfoType[],
    setCurrentPos:(stt:[number,number])=>void
}) => {
    const { sentenceInfos, setCurrentPos } = props
    let rmc = sentenceInfos.find((si) => si.name === '$GNRMC')
    if (rmc === undefined || rmc.sentence === '') {
        rmc = sentenceInfos.find((si) => si.name === '$GPRMC')
    }
    if (rmc) {
        const splitted = rmc.sentence.split(",")
        const lat = dmLocToD(splitted[3], splitted[4] === 'S')
        const lon = dmLocToD(splitted[5], splitted[6] === 'W')
        if (isNaN(lat) || isNaN(lon)) {
            return <div>Not Position Fixed</div>
        } else {
            setCurrentPos([lat, lon])
            return <div>{lat.toFixed(6) + " " + lon.toFixed(6)}</div>
        }
    }
    return <div>No RMC SENTENCE</div>
}


export const PositionMap = (props: { sentenceInfos: sentenceInfoType[] }) => {
    const { sentenceInfos } = props

    const [currentPos, setCurrentPos] = useState<[number, number]>([35.450329,139.634197])
    const [map, setMap] = useState(null)
  
    useEffect(()=>{
        if (map) {
            map.flyTo(currentPos)
        } else {
            console.log("PosUpdatd", currentPos)
        }
    }, [map, currentPos])

    const displayMap = useMemo(
        () => (
            <>
                <MapContainer
                    center={currentPos}
                    zoom={13}
                    scrollWheelZoom={true}
                    ref={setMap}
                >
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="淡色">
                            <TileLayer
                                attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>国土地理院</a>"
                                url='https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'
                            />
                        </LayersControl.BaseLayer>

                        <LayersControl.BaseLayer name="白地図">
                            <TileLayer
                                attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>国土地理院</a>"
                                url='https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="標準">
                            <TileLayer
                                attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
                                url='https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="写真">
                            <TileLayer
                                attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
                                url='https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg                    '
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <Marker position={currentPos}>
                        <Popup>CurrentPosition</Popup>
                    </Marker>

                </MapContainer>
          </>
        ),
        [currentPos],
    )            
    return (
        <div>
            {map ? <UpdatePosByRmc sentenceInfos={sentenceInfos} setCurrentPos={setCurrentPos}/> : null}        
            {displayMap}
        </div>
    )
}    
    










/*
    return (
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            whenCreated={setMap}
        >
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="淡色">
                    <TileLayer
                        attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>国土地理院</a>"
                        url='https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="白地図">
                    <TileLayer
                        attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>国土地理院</a>"
                        url='https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="標準">
                    <TileLayer
                        attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
                        url='https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="写真">
                    <TileLayer
                        attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
                        url='https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg                    '
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <Marker position={position}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
    */
