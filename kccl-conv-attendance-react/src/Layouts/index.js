import React from "react";
import HeaderImage from "../Assets/header.png";

export default function Layouts({ children }) {

    return (
        <div>
            <div><img src={HeaderImage} alt="kccl-header" style={{width: '100%'}}/></div>
            <div style={{marginTop: '-6px'}}>{children}</div>
        </div>
    )
}