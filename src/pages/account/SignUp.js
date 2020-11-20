import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";

//회원가입 페이지

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

const SignUp = () => {
    const classes = useStyles();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [email, setEmail] = useState("");
    const [validUserId, setValidUserId] = useState("");
    const [validPassword, setValidPassword] = useState("");
    const [validEmail, setValidEmail] = useState("");

    const history = useHistory();

    const handleSubmit = (e) => {
        if (password === passwordConfirm) {
            // 비밀번호 일치할때
            e.preventDefault();
            const userJson = {
                username: userId,
                email: email,
                password1: password,
                password2: passwordConfirm,
            };
            axios
                .post(`https://bcbackend.azurewebsites.net/api/rest-auth/registration/`, userJson)
                .then((response) => {
                    history.push("/");
                })
                .catch((error) => {
                    if (error.response.data.username !== undefined) {
                        setValidUserId(error.response.data.username);
                    } else {
                        setValidUserId("");
                    }
                    if (error.response.data.email !== undefined) {
                        setValidEmail(error.response.data.email);
                    } else {
                        setValidEmail("");
                    }
                    if (error.response.data.password1 !== undefined) {
                        setValidPassword(error.response.data.password1);
                    } else {
                        setValidPassword("");
                    }
                    // 유저 유효성 체크
                    console.log(JSON.stringify(error.response.data));
                    throw error;
                });
        } else {
            alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}></Avatar>
                <Typography component="h2" variant="h5">
                    회원가입
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            error={validUserId !== "" ? true : false}
                            helperText={validUserId}
                            id="userId"
                            label="아이디"
                            name="userId"
                            autoComplete="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            error={validEmail !== "" ? true : false}
                            helperText={validEmail}
                            id="email"
                            label="이메일"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            error={validPassword !== "" ? true : false}
                            helperText={validPassword}
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="passwordConfirm"
                            label="비밀번호 확인"
                            type="password"
                            id="passwordConfirm"
                            autoComplete="current-password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox value="allowExtraEmails" color="primary" />} label="약관동의" />
                    </Grid>
                </Grid>

                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleSubmit}>
                    회원가입
                </Button>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Link to="/">{"계정이 있으십니까 ?"}</Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};
export default SignUp;
