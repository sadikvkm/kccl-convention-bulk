import React, { useCallback, useEffect, useState } from "react";
import Layouts from "../../Layouts";
import ReaderDisplayBox from "../../Components/ReaderDisplayBox";
import { appRequest, getUrlQuery } from "../../services";
import { useLocation } from "react-router-dom";

export default function Readers() {

    const location = useLocation();
    const getNo = getUrlQuery(location, 'gate')

    const [isInitialFetching, setIsInitialFetching] = useState(true);
    const [value, setValue] = useState("101327");
    const [errors, setErrors] = useState("")
    const [isImageReload, setImageReload] = useState(false);
    const [validUser, setValidUser] = useState("")
    const [attendedCount, setAttendedCount] = useState({
        total: 0,
        attended: 0
    })

    const fetchDetails = useCallback(() => {
        appRequest.get('/attendance/reported/count?gate=' + getNo)
        .then(res => {
            setAttendedCount(res.data.result)
            setIsInitialFetching(false)
        })
        .catch(error => {
            
        })
    }, [])

    useEffect(() => {
        fetchDetails()
    }, [fetchDetails])

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!value) return;
        setErrors('')
        setImageReload(true);
        appRequest.post('/attendance/report', { registerNo:  value.trim(), gate: getNo})
        .then(res => {
            setImageReload(false)
            setValidUser(res.data.result)
            setIsInitialFetching(false)
            fetchDetails();
            setValue("")
            document.getElementById('data-reader-input').focus()
        })
        .catch(error => {
            setErrors(error.errors)
            setImageReload(false)
            setIsInitialFetching(false)
            setValidUser("")
            document.getElementById('data-reader-input').focus()
            document.getElementById('data-reader-input').select()

        })
    }

    if(isInitialFetching) return <div>Loading...</div>

    const actionStatus = () => {

        const style = {}

        if(errors.registerNo) {
            style.background = 'red';
            style.color = '#fff';
        }else if(validUser?.id) {
            style.background = 'unset';
            style.color = 'black';
        }

        return style;
    }

    return (
        <Layouts>
            <div style={{display: 'flex', height: '88vh'}}>
                <div style={{width: '100%', marginTop: 10}}>
                    <ReaderDisplayBox reloadImage={isImageReload} data={{...validUser}} label={'Gate ' + getNo} count={attendedCount}>
                        <form onSubmit={handleSubmit}>
                            <input id="data-reader-input" onChange={e => setValue(e.target.value)} className="custom-input-box" type="text" value={value} style={{...actionStatus(), marginTop: 20}} autoFocus/>
                            <div style={{marginTop: 10, color: 'red'}}>{errors.registerNo}</div>
                        </form>
                    </ReaderDisplayBox>
                </div>
            </div>
        </Layouts>
    )
}