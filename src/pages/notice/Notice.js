import React, { useState, useEffect } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link, useLocation, useHistory } from "react-router-dom";
import axios from "axios";

// 공지사항

export default function Notice() {
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
            .get(`/api/notice/`, headers)
            .then((response) => {
                setNoticeList(response.data);
            })
            .catch((error) => {
                throw error;
            });
    }, [history]);

    const [noticeList, setNoticeList] = useState([]);
    const location = useLocation();

    const handleBack = (e) => {
        e.preventDefault();

        if (location.state !== undefined) {
            if (location.state.value === "Detail") {
                history.push({
                    pathname: "/MyBc",
                    state: { FooterValue: 4 },
                });
            } else if (location.state.value === "MyBc") {
                history.push({
                    pathname: "/MyBc",
                    state: { FooterValue: 0 },
                });
            }
        }
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Paper elevation={0}>
                        <ArrowBackIosIcon style={{ marginLeft: "10px", float: "left", fontSize: 35 }} onClick={handleBack} />
                        <h1 style={{ margin: "1rem", marginLeft: "50px" }}>공지사항</h1>
                    </Paper>
                </Grid>
                <br />
                <br />
                <br />
                <br />
                <br />

                {
                    // map 함수를 사용해서 axios로 받은 데이터 뿌리기
                    noticeList.map((data, i) => (
                        <Grid item xs={12} style={{ lineHeight: "1.5" }} key={i}>
                            <Link to={`/NoticeDetail/${data.id}`} style={{ textDecoration: "none" }}>
                                <Paper elevation={0}>
                                    <p
                                        style={{
                                            fontSize: 18,
                                            marginTop: "auto",
                                            marginBottom: "auto",
                                            display: "inline-block",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {data.title}
                                    </p>
                                    <br />
                                    <p style={{ color: "#b9b5b5", top: "10px" }}>{data.create_date.substring(0, 10)}</p>
                                    <hr />
                                </Paper>
                            </Link>
                        </Grid>
                    ))
                }
            </Grid>
        </>
    );
}
