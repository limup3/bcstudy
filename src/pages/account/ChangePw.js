import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import axios from "axios";

//패스워드 재설정

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const ChangePw = () => {
    const history = useHistory();
    useEffect(() => {
        //로그인 하지 않은 유저는 로그인 페이지로 리다이렉션
        if (localStorage.getItem("userKey") === null && sessionStorage.getItem("userKey") === null) {
            alert("로그인이 필요합니다.");
            history.push("/");
        }
    }, [history]);

    const classes = useStyles();
    //   const [userId] = useState(JSON.parse(sessionStorage.userData).userId);
    //   const [userId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [validPassword, setValidPassword] = useState("");
    const [validpasswordConfirm, setValidPasswordConfirm] = useState("");

    const handleBack = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/MyBc",
            state: { FooterValue: 4 },
        });
    };
    //경고창 없애기 위한 eslint 비활성화
    //eslint-disable-next-line
    const token = localStorage.getItem("userKey") && localStorage.getItem("userKey").replace(/\"/gi, "");
    //세션에 저장된 키 불러온뒤 ""제거
    const handleChangePw = (e) => {
        if (password === passwordConfirm) {
            // 비밀번호 일치할때
            e.preventDefault();
            const userJson = {
                new_password1: password,
                new_password2: passwordConfirm,
            };

            const headers = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            };
            //토큰 헤더로 보내기
            axios
                .post(`/api/rest-auth/password/change/`, userJson, headers)
                .then((response) => {
                    alert("비밀번호 재설정 완료 !");
                    // history.push({
                    //   pathname:'/MyBc',
                    //   state: { FooterValue: 4}
                    // })
                    localStorage.removeItem("userKey");
                    history.push("/");
                })
                .catch((error) => {
                    if (error.response.data.new_password1 !== undefined) {
                        setValidPassword(error.response.data.new_password1);
                    } else {
                        setValidPassword("");
                    }
                    if (error.response.data.new_password2 !== undefined) {
                        setValidPasswordConfirm(error.response.data.new_password2);
                    } else {
                        setValidPasswordConfirm("");
                    }
                    // 유저 유효성 체크
                    throw error;
                });
        } else {
            alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요");
        }
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Paper elevation={0} style={{ background: "#fafafa" }}>
                        <ArrowBackIosIcon
                            style={{ marginLeft: "10px", marginBottom: "10px", float: "left", fontSize: 25 }}
                            onClick={handleBack}
                        />
                        <h2 style={{ margin: "1rem", marginLeft: "50px" }}>뒤로가기</h2>
                    </Paper>
                </Grid>
            </Grid>

            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}></Avatar>
                    <Typography component="h2" variant="h5">
                        비밀번호 재설정
                    </Typography>
                    <form className={classes.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    error={validPassword !== "" ? true : false}
                                    helperText={validPassword}
                                    id="password"
                                    label="새 비밀번호"
                                    type="password"
                                    name="password"
                                    autoComplete="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    error={validpasswordConfirm !== "" ? true : false}
                                    helperText={validpasswordConfirm}
                                    id="password"
                                    label="새 비밀번호 확인"
                                    type="password"
                                    name="password"
                                    autoComplete="password"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}></Grid>
                        </Grid>
                        <Link to="/">
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleChangePw}
                            >
                                재설정
                            </Button>
                        </Link>
                    </form>
                </div>
            </Container>
        </>
    );
};
export default ChangePw;
