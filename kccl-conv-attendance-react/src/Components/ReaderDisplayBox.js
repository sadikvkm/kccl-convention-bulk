import React, { useEffect, useState } from "react";

export default function ReaderDisplayBox({ reloadImage = false, children, count = {}, label = "", data = {} }) {

    const [isImageReloadSet, setImageReloadSet] = useState(false);

    useEffect(() => {
        setImageReloadSet(reloadImage)
    }, [reloadImage])

    return (
        <div style={{justifyContent: 'center', display: 'flex'}} className="reader-display-box">
            <div style={{textAlign: 'center'}}>
                <div style={{fontSize: 35, fontWeight: 800}}>{label}</div>
                <div style={{color: '#878787', marginBottom: 30, marginTop: -5}}>{count.attended} of {count.total}</div>
                <div style={{background: '#f6f6f6', margin: '0 auto', border: '1px dashed #414141', borderRadius: 2, height: 330, width: 280}}>
                    {reloadImage && <div style={{marginTop: '50%'}}>Loading...</div>}
                    {data?.image && !reloadImage && <img src={data.image} alt="KCCL-Member" style={{objectFit: 'contain', width: '100%', height: '100%'}} /> }
                </div>
                    <div style={{marginTop: 10, fontWeight: 800, fontSize: 25}}>{data.name ?? '---'}</div>
                    <div style={{marginTop: 0}}>{data.mekhala}, {data.district}</div>
                <div style={{marginTop: 10}}>{children}</div>
            </div>
        </div>
    )
}