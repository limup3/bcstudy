import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

//그룹 등록 2

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

export default function GroupAddNext() {
    const classes = useStyles();
    const history = useHistory();
    useEffect(() => {
        //로그인 하지 않은 유저는 로그인 페이지로 리다이렉션
        if (localStorage.getItem("userKey") === null && sessionStorage.getItem("userKey") === null) {
            alert("로그인이 필요합니다.");
            history.push("/");
        }
    }, [history]);
    const location = useLocation();
    const [bcBookId, setBcBookId] = useState("");

    const handleBack = (e) => {
        e.preventDefault();
        if (location.state !== undefined) {
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
                .delete(
                    `/api/groupbusinesscard/${location.state.groupPk}`,
                    { name: location.state.groupId, user_id: location.state.userPk },
                    headers
                )
                .then((response) => {
                    history.push({
                        pathname: "/MyBc",
                        state: { FooterValue: 1 },
                    });
                })
                .catch((error) => {
                    throw error;
                });
        } else
            history.push({
                pathname: "/MyBc",
                state: { FooterValue: 1 },
            });
    };

    const handleCreate = (e) => {
        e.preventDefault();

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
            .post(`/api/businesscardbook/`, { name: bcBookId, user_id: location.state.userPk, group_id: location.state.groupPk }, headers)
            .then((response) => {
                history.push({
                    pathname: "/BcImport",
                    state: { value: "GroupAddNext", addBookId: response.data.id },
                });
            })
            .catch((error) => {
                alert(error.response.data.name);
                throw error;
            });
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Paper elevation={0}>
                        <CloseIcon style={{ marginLeft: "10px", float: "left", fontSize: 35 }} onClick={handleBack} />
                        <h1 style={{ margin: "1rem", marginLeft: "50px" }}>명함첩 만들기</h1>
                    </Paper>
                </Grid>
            </Grid>
            <Card style={{ margin: "1rem" }}>
                <CardContent>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="outlined-basic"
                            label="명함첩을 입력하세요"
                            variant="outlined"
                            style={{ right: "10px", width: "100%" }}
                            value={bcBookId}
                            onChange={(e) => setBcBookId(e.target.value)}
                        />
                    </form>
                    <br />
                    <Button variant="contained" color="primary" style={{ width: "100%" }} onClick={handleCreate}>
                        만들기
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
