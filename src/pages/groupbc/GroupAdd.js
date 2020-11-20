import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";

//그룹 등록 1

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

export default function GroupAdd() {
    const classes = useStyles();

    const [groupId, setGroupId] = useState("");

    const history = useHistory();
    useEffect(() => {
        //로그인 하지 않은 유저는 로그인 페이지로 리다이렉션
        if (localStorage.getItem("userKey") === null && sessionStorage.getItem("userKey") === null) {
            alert("로그인이 필요합니다.");
            history.push("/");
        }
    }, [history]);

    const handleBack = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/MyBc",
            state: { FooterValue: 1 },
        });
    };

    const handleCreate = () => {
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
            .get("https://bcbackend.azurewebsites.net/api/rest-auth/user/", headers)
            .then((response) => {
                var userPk = response.data.pk;
                axios
                    .post(
                        `https://bcbackend.azurewebsites.net/api/groupbusinesscard/`,
                        { name: groupId, user_id: response.data.pk },
                        headers
                    )
                    .then((response) => {
                        history.push({
                            pathname: "/GroupAddNext",
                            state: { groupPk: response.data.id, userPk: userPk, name: groupId },
                        });
                    })
                    .catch((error) => {
                        alert(error.response.data.name);
                        throw error;
                    });
            })
            .catch((error) => {
                throw error;
            });
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Paper elevation={0}>
                        <CloseIcon style={{ marginLeft: "10px", float: "left", fontSize: 35 }} onClick={handleBack} />
                        <h1 style={{ margin: "1rem", marginLeft: "50px" }}>그룹 만들기</h1>
                    </Paper>
                </Grid>
            </Grid>
            <Card style={{ margin: "1rem" }}>
                <CardContent>
                    <p style={{ fontSize: "13px", color: "gray" }}>그룹의 명칭은 그룹명함에서 변경할 수 있습니다.</p>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="outlined-basic"
                            label="그룹명을 입력하세요"
                            variant="outlined"
                            style={{ right: "10px", width: "100%" }}
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                        />
                    </form>
                    <br />
                    <Button variant="contained" color="primary" style={{ width: "100%" }} onClick={handleCreate}>
                        다음
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
