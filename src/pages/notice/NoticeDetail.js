import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useBc } from "../../helpers/context/BcContext";
import axios from "axios";

//공지사항 상세내용

export default function NoticeDetail({ match }) {
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
            .get(`/api/notice/${match.params.id}`, headers)
            .then((response) => {
                setNoticeData(response.data);
            })
            .catch((error) => {
                throw error;
            });
    }, [history, match.params.id]);

    const [noticeData, setNoticeData] = useState([]);
    const bcData = useBc();

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Paper elevation={0}>
                        <ArrowBackIosIcon
                            style={{ marginLeft: "10px", float: "left", fontSize: 35, marginTop: "16px" }}
                            onClick={bcData.handleBack}
                        />
                    </Paper>
                </Grid>
                <br />
                <br />
                <br />
                <br />
                <br />
                <Grid item xs={12} style={{ lineHeight: "1.5" }}>
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
                            {noticeData.title}
                        </p>
                        <br />
                        <p style={{ color: "#b9b5b5", top: "10px" }}>{noticeData.create_date && noticeData.create_date.substring(0, 10)}</p>
                        <hr />
                    </Paper>
                    <br />
                    <Paper elevation={0}>
                        <p style={{ fontSize: 16, margin: "1rem" }}>{noticeData.content}</p>
                        <br />
                        <br />
                    </Paper>
                    <img style={{ margin: "1rem" }} src={noticeData.image} alt={"공지사항 이미지"} />
                </Grid>
            </Grid>
        </>
    );
}
