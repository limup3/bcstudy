import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

//Context Api 를 사용하기 위해 만든 컨택스트파일

//상태를 전역으로 관리 , 현재는 명함 데이터 관리용도

const BcContext = React.createContext();
const SetBcContext = React.createContext();
// const LocalStorageContext = React.createContext()

export function useBc() {
    return useContext(BcContext);
}

export function useSetBc() {
    return useContext(SetBcContext);
}

// export function useLS() {
//     return useContext(LocalStorageContext)
// }

export function BcProvider({ children }) {
    const [bcName, setBcName] = useState("");
    const [bcPosition, setBcPosition] = useState("");
    const [bcDepartment, setBcDepartment] = useState("");
    const [bcCompany, setBcCompany] = useState("");
    const [bcCreateDate, setBcCreateDate] = useState("");
    const [bcMobile, setBcMobile] = useState("");
    const [bcPhone, setBcPhone] = useState("");
    const [bcDirect, setBcDirect] = useState("");
    const [bcEmail, setBcEmail] = useState("");
    const [bcFax, setBcFax] = useState("");
    const [bcAddr, setBcAddr] = useState("");
    const [bcEName, setBcEName] = useState("");
    const [bcECompany, setBcECompany] = useState("");
    const [bcEPosition, setBcEPosition] = useState("");
    const [bcEDepartment, setBcEDepartment] = useState("");
    const [bcEAddr, setBcEAddr] = useState("");

    const setbcinformation = {
        setBcName: setBcName,
        setBcPosition: setBcPosition,
        setBcDepartment: setBcDepartment,
        setBcCompany: setBcCompany,
        setBcCreateDate: setBcCreateDate,
        setBcMobile: setBcMobile,
        setBcPhone: setBcPhone,
        setBcDirect: setBcDirect,
        setBcEmail: setBcEmail,
        setBcFax: setBcFax,
        setBcAddr: setBcAddr,
        setBcEName: setBcEName,
        setBcECompany: setBcECompany,
        setBcEPosition: setBcEPosition,
        setBcEDepartment: setBcEDepartment,
        setBcEAddr: setBcEAddr,
    };

    const bcinformation = {
        bcName: bcName,
        bcPosition: bcPosition,
        bcDepartment: bcDepartment,
        bcCompany: bcCompany,
        bcCreateDate: bcCreateDate,
        bcMobile: bcMobile,
        bcPhone: bcPhone,
        bcDirect: bcDirect,
        bcEmail: bcEmail,
        bcFax: bcFax,
        bcAddr: bcAddr,
        bcEName: bcEName,
        bcECompany: bcECompany,
        bcEPosition: bcEPosition,
        bcEDepartment: bcEDepartment,
        bcEAddr: bcEAddr,
    };

    const history = useHistory();

    const handleBack = (e) => {
        e.preventDefault();
        history.goBack();
    };

    // if(localStorage.userKey !== undefined) {
    // //경고창 없애기 위한 eslint 비활성화
    // //eslint-disable-next-line
    // const token = localStorage.getItem('userKey') && localStorage.getItem('userKey').replace(/\"/gi, "");
    // //세션에 저장된 키 불러온뒤 ""제거
    // }

    // const headers = {
    //     headers: {
    //       Authorization: `Token ${token}`
    //     }
    //   }

    const value = { bcinformation, handleBack };

    const setValue = { setbcinformation };

    return (
        // <LocalStorageContext.Provider value={headers}>
        <SetBcContext.Provider value={setValue}>
            <BcContext.Provider value={value}>{children}</BcContext.Provider>
        </SetBcContext.Provider>
        // </LocalStorageContext.Provider>
    );
}
