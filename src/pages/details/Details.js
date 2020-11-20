import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import ImageIcon from "@material-ui/icons/Image";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import DevicesIcon from "@material-ui/icons/Devices";
import LockIcon from "@material-ui/icons/Lock";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

//하단 바 더보기 목록 , BottomNavigation을 사용하여 아이콘 분류

const useStyles = makeStyles({
    root: {
        float: "left",
    },
    input: {
        display: "none",
    },
});

const handleLater = (e) => {
    e.preventDefault();
    alert("추후 예정");
};

export default function Details() {
    const classes = useStyles();

    const history = useHistory();
    useEffect(() => {
        //로그인 하지 않은 유저는 로그인 페이지로 리다이렉션
        if (localStorage.getItem("userKey") === null && sessionStorage.getItem("userKey") === null) {
            alert("로그인이 필요합니다.");
            history.push("/");
        }
    }, [history]);

    //상태관리 notice에서 나왔을때 더보기로 갈수있도록 구현
    const handleNotice = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/Notice",
            state: { value: "Detail" },
        });
    };
    //상태관리 bcTyping에서 나왔을때 더보기로 갈수있도록 구현
    const handleTyping = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/BcTyping",
            state: { value: "Detail" },
        });
    };
    //로그아웃 , 세션키와 로컬키로 분류하여 키 삭제
    const handleLogout = (e) => {
        e.preventDefault();
        if (localStorage.getItem("userKey") !== null) {
            localStorage.removeItem("userKey");
        }
        if (sessionStorage.getItem("userKey") !== null) {
            sessionStorage.removeItem("userKey");
        }
        alert("로그아웃 되셨습니다.");
        history.push("/");
    };

    const [loading, setLoading] = useState(false);
    //명함인식DB로 이미지 보내기
    const handleChangeFile = (event) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            // 2. 읽기가 완료되면 아래코드가 실행됩니다.
            const base64 = reader.result;
            if (base64) {
                //경고창 없애기 위한 eslint 비활성화
                //eslint-disable-next-line
                const token = localStorage.getItem("userKey") && localStorage.getItem("userKey").replace(/\"/gi, "");
                //세션에 저장된 키 불러온뒤 ""제거
                const headers = {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                };
                //유저 키값을 가져온 뒤 ocrDB에 base64데이터 전송
                axios
                    .get("https://bcbackend.azurewebsites.net/api/rest-auth/user/", headers)
                    .then((response) => {
                        setLoading(true);
                        axios
                            .post(
                                `https://bcbackend.azurewebsites.net/api/businesscardocr/`,
                                {
                                    type: "Recognizing",
                                    user_id: response.data.pk,
                                    image: base64.toString(),
                                    my_bc: false,
                                },
                                headers
                            )
                            .then((ocrResponse) => {
                                //성공 시 인식 된 명함 가져오기
                                axios
                                    .get(`api/businesscardocr/${ocrResponse.data.id}`, headers)
                                    .then((getOcrResponse) => {
                                        if (getOcrResponse.data.type === "Unrecognizable") {
                                            setLoading(false);
                                            alert("인식불가");
                                        }
                                        if (getOcrResponse.data.type === "Recognizing") {
                                            setLoading(false);
                                            alert("인식률이 떨어집니다. 입력중으로 가서 직접입력해주세요");
                                        }
                                        setLoading(false);
                                        history.push("/Mybc");
                                        window.location.reload();
                                    })
                                    .catch((error) => {
                                        setLoading(false);
                                        throw error;
                                    });
                            })
                            .catch((error) => {
                                console.log(error.response);
                                setLoading(false);
                                throw error;
                            });
                    })
                    .catch((error) => {
                        setLoading(false);
                        throw error;
                    });
            }
        };
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        }
    };

    return (
        <>
            {loading && <CircularProgress color="secondary" style={{ marginLeft: "45%", margin: "45%", width: "10%" }} />}
            {!loading && (
                <>
                    <h1>더보기</h1>
                    <br />
                    <BottomNavigation showLabels className={classes.root}>
                        <BottomNavigationAction label="공지사항" icon={<NotificationsNoneIcon fontSize="large" />} onClick={handleNotice} />
                        <BottomNavigationAction label="FAQ" icon={<HelpOutlineIcon fontSize="large" />} onClick={handleLater} />
                        <BottomNavigationAction label="1:1 문의" icon={<ChatBubbleOutlineIcon fontSize="large" />} onClick={handleLater} />
                        <BottomNavigationAction label="로그아웃" icon={<ExitToAppIcon fontSize="large" />} onClick={handleLogout} />
                    </BottomNavigation>
                    <br />
                    <br />
                    <br />
                    <br />
                    <hr />
                    <h3>명함정보 등록</h3>
                    <div onClick={handleTyping}>
                        <BorderColorIcon /> 직접입력
                    </div>
                    <div style={{ position: "relative", right: "13px" }}>
                        <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={handleChangeFile} />
                        <label htmlFor="icon-button-file">
                            <IconButton color="inherit" aria-label="upload picture" component="span" style={{ fontSize: 15 }}>
                                <ImageIcon />
                                &nbsp;이미지 가져오기
                            </IconButton>
                        </label>
                    </div>
                    {/* <br/><br/> */}
                    {/* <ImageIcon/> 이미지 가져오기 <br/><br/> */}
                    <div onClick={handleLater}>
                        <PhoneAndroidIcon /> 연락처 연동 <br />
                        <br />
                        <DevicesIcon /> 다른 서비스 연동 <br />
                        <br />
                    </div>
                    <h3>계정</h3>
                    <Link to="/ChangePw" style={{ textDecoration: "none", color: "black" }}>
                        <LockIcon /> 비밀번호 재설정
                    </Link>{" "}
                    <br />
                    <br />
                    <Link to="/UserDelete" style={{ textDecoration: "none", color: "black" }}>
                        <PersonAddDisabledIcon /> 회원 탈퇴
                    </Link>{" "}
                    <br />
                    <br />
                </>
            )}
        </>
    );
}
