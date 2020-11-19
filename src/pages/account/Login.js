import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

//로그인 페이지

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    // 로그인 아이콘 중앙정렬 (Sign in 아이콘)
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    // 로그인 아이콘 색상
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    // 폼 정렬
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    //SIGN IN 버튼 정렬
}));

const Login = () => {
    const classes = useStyles();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const history = useHistory();

    useEffect(() => {
        if (localStorage.userKey !== undefined) {
            history.push("/Mybc");
        }
    }, [history]); //history?

    //자동로그인 , 세션값이 있을 시 내명함첩으로 이동

    const handleLoginButton = (e) => {
        e.preventDefault();
        const userJson = {
            username: userId,
            password: password,
        };
        axios
            .post("/api/rest-auth/login/", userJson)
            .then((response) => {
                if (checked === true) {
                    localStorage.setItem("userKey", JSON.stringify(response.data.key));
                    //userKey라는 이름에 토큰 키값 세션저장
                } else if (checked === false) {
                    sessionStorage.setItem("userKey", JSON.stringify(response.data.key));
                    //자동로그인 아닐경우 임시저장
                }
                history.push("/Mybc");
            })
            .catch((error) => {
                alert("로그인 실패 !");
                // alert(JSON.stringify(error.response));
                console.log(error.response);
                throw error;
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}></Avatar>
                <Typography component="h2" variant="h5">
                    로그인
                </Typography>
                <form className={classes.form}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="userId"
                        label="아이디"
                        name="userId"
                        autoComplete="userId"
                        autoFocus
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="비밀번호"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" checked={checked} onChange={handleChange} />}
                        label="자동 로그인"
                    />
                    <Link to="/MyBc">
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleLoginButton}
                        >
                            로그인
                        </Button>
                    </Link>
                    <Grid container>
                        <Grid item xs>
                            <Link to="/UserFindID">{/* {"Forgot id?"} */}</Link>
                        </Grid>
                        <Grid item>
                            <Link to="/SignUp">{"회원가입"}</Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
export default Login;
