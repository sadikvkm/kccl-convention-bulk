import React, { useCallback, useEffect, useState } from "react";
import Layouts from "../../Layouts";
import ReaderDisplayBox from "../../Components/ReaderDisplayBox";
import { useLocation } from "react-router-dom";
import { appRequest, getUrlQuery } from "../../services";
import { socket } from "../../socket";

export default function Display() {

    const location = useLocation();
    const getNo = getUrlQuery(location, 'gate');
    const spitedDate = getNo.split(',');
    console.log(spitedDate)
    const [gateData, setGateData] = useState([{data: {}}, {data: {}}]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [attendedCount, setAttendedCount] = useState({
        total: 0,
        attended: 0
    })

    const fetchDetails = useCallback(() => {
        appRequest.get('/attendance/gate/display?gate=' + getNo)
        .then(res => {
            setGateData(res.data.result.completed)
            setAttendedCount(res.data.result.count)
        })
        .catch(error => {
            
        })
    }, [getNo])

    useEffect(() => {
        fetchDetails();


        function onConnect() {
            setIsConnected(true);
        }
    
        function onDisconnect() {
            setIsConnected(false);
        }
    
        function onFooEvent(value) {
            console.log(value, 'sasd')
            setGateData(p => p.map(i => {

                if(i.gate === value.gate) {
                    return {
                        ...value
                    }
                }

                return i
            }))
        }
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('new-attendance-received', onFooEvent);
    
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('foo', onFooEvent);
        };

    }, [fetchDetails])

    console.log(gateData, 'gateData')

    return (
        <Layouts>
            <div style={{display: 'flex', height: '88vh', marginTop: 30}}>
                <div style={{width: '100%'}}><ReaderDisplayBox label={'Gate ' + spitedDate[0]} count={gateData[0]['gateCount']} data={gateData[0]['data']} /></div>
                <div style={{width: '100%', borderLeft: '1px solid #d3d1d1'}}><ReaderDisplayBox label={'Gate ' + spitedDate[1]} count={gateData[1]['gateCount']} data={gateData[1]['data']}/></div>
            </div>
        </Layouts>
    )
}