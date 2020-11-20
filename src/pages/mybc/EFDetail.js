import React, { useState, useEffect } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

//입력중인 명함에서 입력불가에 대한 상세내용 페이지
const useStyles = makeStyles((theme) => ({
    input: {
        display: "none",
    },
}));

export default function EFDetail({ match }) {
    const classes = useStyles();
    const history = useHistory();
    useEffect(() => {
        //로그인 하지 않은 유저는 로그인 페이지로 리다이렉션
        if (localStorage.getItem("userKey") === null && sessionStorage.getItem("userKey") === null) {
            alert("로그인이 필요합니다.");
            history.push("/");
        }
        //경고창 없애기 위한 eslint 비활성화
        //eslint-disable-next-line
        const token = localStorage.getItem("userKey") && localStorage.getItem("userKey").replace(/\"/gi, "");
        //세션에 저장된 키 불러온뒤 ""제거
        const headers = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };

        axios
            .get(`https://bcbackend.azurewebsites.net/api/businesscardocr/${match.params.id}`, headers)
            .then((response) => {
                setEFData(response.data);
            })
            .catch((error) => {
                throw error;
            });
    }, [history, match.params.id]);

    const [EFData, setEFData] = useState([]);

    const handleDelete = () => {
        //경고창 없애기 위한 eslint 비활성화
        //eslint-disable-next-line
        const token = localStorage.getItem("userKey") && localStorage.getItem("userKey").replace(/\"/gi, "");
        //세션에 저장된 키 불러온뒤 ""제거
        const headers = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };

        axios
            .delete(`https://bcbackend.azurewebsites.net/api/businesscardocr/${match.params.id}/`, headers)
            .then((response) => {
                history.push({
                    pathname: "/BcEntering",
                    state: { EnteringValue: 1 },
                });
            })
            .catch((error) => {
                alert("실패");
                console.log(error.response);
                throw error;
            });
    };

    const handleTyping = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/BcTyping",
            state: { value: "EFDetail", ocrId: match.params.id },
        });
    };
    const handleBack = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/BcEntering",
            state: { EnteringValue: 1 },
        });
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
                                    .get(`https://bcbackend.azurewebsites.net/api/businesscardocr/${ocrResponse.data.id}`, headers)
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
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper elevation={0}>
                                <ArrowBackIosIcon style={{ marginLeft: "10px", float: "left", fontSize: 35 }} onClick={handleBack} />
                                <h1 style={{ margin: "1rem", marginLeft: "50px" }}>상세정보</h1>
                            </Paper>
                        </Grid>
                    </Grid>
                    {EFData.image !== null && <img style={{ width: "300px", margin: "0.4rem" }} src={EFData.image} alt={"명함이미지"} />}

                    <p>명함 인식이 불가능합니다. 재촬영 또는 직접입력을 해주세요.</p>
                    <br />
                    <br />
                    <br />
                    <input
                        accept="image/*"
                        capture="camera"
                        className={classes.input}
                        id="icon-button-file"
                        type="file"
                        onChange={handleChangeFile}
                    />
                    <label htmlFor="icon-button-file">
                        <p style={{ color: "green" }}>재촬영</p>
                    </label>
                    <br />
                    <p onClick={handleTyping}>직접입력</p>
                    <br />
                    <p style={{ color: "red" }} onClick={handleDelete}>
                        명함 삭제
                    </p>
                    <br />
                </>
            )}
        </>
    );
}
