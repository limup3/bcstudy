import React, { useState, useEffect } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useBc } from "../../helpers/context/BcContext";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory } from "react-router-dom";

//명함첩명 변경

export default function GroupBcRename({ match }) {
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
            .get(`https://bcbackend.azurewebsites.net/api/businesscardbook/${match.params.id}/`, headers)
            .then((response) => {
                setBookName(response.data.name);
            })
            .catch((error) => {
                throw error;
            });
    }, [history, match.params.id]);

    const bcData = useBc();
    const [bookName, setBookName] = useState("");

    const handleComplete = () => {
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
            .patch(
                `https://bcbackend.azurewebsites.net/api/businesscardbook/${match.params.id}/`,
                {
                    name: bookName,
                },
                headers
            )
            .then((response) => {
                history.push({
                    pathname: "/MyBc",
                    state: { FooterValue: 1 },
                });
            })
            .catch((error) => {
                alert("실패");
                console.log(error.response);
                throw error;
            });
    };

    return (
        <>
            <Grid container>
                <Grid item xs={10}>
                    <Paper elevation={0}>
                        <ArrowBackIosIcon style={{ marginLeft: "10px", float: "left", fontSize: 35 }} onClick={bcData.handleBack} />
                        <h1 style={{ margin: "1rem", marginLeft: "50px" }}>명함첩명 변경</h1>
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Button style={{ color: "green", fontSize: 20, margin: "1rem", float: "right" }} onClick={handleComplete}>
                        완료
                    </Button>
                </Grid>
            </Grid>
            <form noValidate autoComplete="off">
                <TextField fullWidth id="standard-basic" value={bookName} onChange={(e) => setBookName(e.target.value)} />
            </form>
        </>
    );
}
