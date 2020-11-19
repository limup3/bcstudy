import React from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import "./Header.css";

//페이지 상단 구성 (로고 직접입력 지도 검색 공지사항)

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
}));

const handleLater = (e) => {
    e.preventDefault();
    alert("추후 예정");
};

export default function Header() {
    const classes = useStyles();
    const history = useHistory();

    const handleNotice = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/Notice",
            state: { value: "MyBc" },
        });
    };

    const handleTyping = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/BcTyping",
            state: { value: "MyBc" },
        });
    };

    return (
        <div className={classes.root}>
            <Grid container className="Container">
                <Grid item xs={6}>
                    <Link to="/Mybc">
                        <img className="Header_Left" src={"/header_images/Logo.png"} alt={"로고이미지"} />
                    </Link>
                    <img className="Header_Left" src={"/header_images/Pen.JPG"} alt={"직접입력"} onClick={handleTyping} />
                </Grid>
                <Grid item xs={6}>
                    <img className="Header_Right" src={"/header_images/Notice.JPG"} alt={"공지사항"} onClick={handleNotice} />
                    <img className="Header_Right" src={"/header_images/Search.JPG"} alt={"검색"} onClick={handleLater} />
                    <img className="Header_Right" src={"/header_images/Map.JPG"} alt={"지도"} onClick={handleLater} />
                </Grid>
            </Grid>
        </div>
    );
}
