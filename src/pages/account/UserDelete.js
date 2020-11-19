import React, { useState } from "react";
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
// import axios from 'axios';

//회원탈퇴 페이지 , 디자인만 완성 기능구현은 추후 예정

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

const UserDelete = () => {
    const classes = useStyles();
    //   const [userId] = useState(JSON.parse(sessionStorage.userData).userId);
    //   const [userId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const history = useHistory();

    const handleBack = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/MyBc",
            state: { FooterValue: 4 },
        });
    };

    const handleWithDraw = (e) => {
        // e.preventDefault();
        // const userJson = {
        //   userId: userId,
        //   password: password,
        // }
        // if(password === JSON.parse(sessionStorage.userData).password ){
        //   if( password === confirmPassword ) {
        //     axios.post(`http://localhost:8080/user/delete`,userJson)
        //     .then(() => {
        //       sessionStorage.clear();
        //       alert("회원탈퇴 완료");
        //       history.push("/");
        //     }).catch(
        //       error => { throw (error) }
        //     )
        //   } else {
        //     alert("비밀번호와 비밀번호 확인이 일치하지않습니다.");
        //     setPassword("");
        //     setConfirmPassword("");
        //   }
        // } else {
        //   alert("비밀번호가 일치하지 않습니다.");
        //     setPassword("");
        //     setConfirmPassword("");
        // }
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
                        회원탈퇴
                    </Typography>
                    <form className={classes.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="password"
                                    label="비밀번호"
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
                                    id="password"
                                    label="비밀번호 확인"
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
                                onClick={handleWithDraw}
                            >
                                탈퇴
                            </Button>
                        </Link>
                    </form>
                </div>
            </Container>
        </>
    );
};
export default UserDelete;
