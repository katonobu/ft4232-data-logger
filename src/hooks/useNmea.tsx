import {useState, useEffect} from 'react'
import {CreHandler} from '../control/creHandler'

let sentenceGroup:string[] = []
export const useNmeaRxSentences = (creHandler:CreHandler|null, analyseSentences:string[]):string[] => {
    const [sentences, setSentences] = useState<string[]>([])
    useEffect(()=>{
        if (creHandler) {
            creHandler.subscribeEvt((evt:string)=>{
                let rxSentence = ""
                if (evt.startsWith("$")) {
                    rxSentence = evt
                } else if (evt.startsWith("| $")) {
                    rxSentence = evt.slice(2)
                } 
                if (rxSentence.startsWith(analyseSentences[0])){
                    sentenceGroup = []                    
                }
                sentenceGroup.push(rxSentence)
                /*
                if (rxSentence.startsWith('$GNZDA')) {
                    console.log(rxSentence)
                }
                */
                if (rxSentence.startsWith(analyseSentences[analyseSentences.length - 1])){
                    setSentences(sentenceGroup)
                }
            })
        }
    },[creHandler])
    return sentences
}

export type sentenceInfoType = {
    name:string,
    sentence:string
}

export const useNmeaSingleLineAnalyseSentence = (rxSentences:string[],analyseSentences:string[]):sentenceInfoType[] => {
    const sentenceInfos = analyseSentences.map((reg)=>{
        return {name:reg, sentence:""}
    })
    sentenceInfos.forEach((si)=>{
        rxSentences.forEach((sentence)=>{
            if (sentence.startsWith(si.name)){
                si.sentence = sentence
            }
        })
    })
    return sentenceInfos
}

export const extractZdaString = (zdaSentenceInfo:sentenceInfoType | undefined):Date => {
    let dateTime = new Date('1980-01-06T00:00:00')
    if (zdaSentenceInfo) {
        const splitted = zdaSentenceInfo.sentence.split(",")
        if (4 < splitted.length) {
            const year = splitted[4]
            const month = splitted[3]
            const day = splitted[2]
            const hour = splitted[1].slice(0, 2)
            const min = splitted[1].slice(2, 4)
            const sec = splitted[1].slice(4)
            dateTime = new Date(Date.UTC(
                parseInt(year,10),
                parseInt(month,10) - 1,
                parseInt(day, 10),
                parseInt(hour, 10),
                parseInt(min, 10),
                parseFloat(sec)
            ))
        }
    }
    return dateTime
}

export const dmLocToD = (str: string, isMinus: boolean) => {
    const locDegMin = parseFloat(str)
    const locDegInt = Math.floor(locDegMin / 100)
    const locMin = (locDegMin / 100 - locDegInt) * 100
    const locDegFloat = locDegInt + locMin / 60
    return isMinus ? (-locDegFloat) : locDegFloat
}
