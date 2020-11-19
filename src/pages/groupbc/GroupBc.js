import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Badge from "@material-ui/core/Badge";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

//그룹명함첩

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 20,
        margin: "1.2rem",
    },
    border_line: {
        backgroundColor: "#f7f5f5",
    },
    gbc_join: {
        color: "#b9b5b5",
    },
    gbc_add: {
        float: "right",
    },
    gcb_bcName: {
        float: "left",
        fontSize: 20,
        margin: "1.5rem",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "left",
        color: theme.palette.text.secondary,
    },
}));

export default function Groupbc() {
    const classes = useStyles();
    const history = useHistory();
    const [groupBcList, setGroupBcList] = useState([]);
    const [bookBcList, setBookBcList] = useState([]);

    useEffect(() => {
        // 유저 키값 가져온 뒤 키값 성공 시 groupbc / bookbc 데이터 가져오기

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
            .get("/api/rest-auth/user/", headers)
            .then((response) => {
                axios
                    .get(`/api/groupbusinesscard?user_id=${response.data.pk}`, headers)
                    .then((response) => {
                        setGroupBcList(response.data);
                    })
                    .catch((error) => {
                        throw error;
                    });
                axios
                    .get(`/api/businesscardbook?user_id=${response.data.pk}`, headers)
                    .then((response) => {
                        setBookBcList(response.data);
                    })
                    .catch((error) => {
                        throw error;
                    });
            })
            .catch((error) => {
                throw error;
            });
    }, [history]);

    // 그룹 삭제
    const handleGroupDelete = (event) => {
        const { myValue } = event.currentTarget.dataset;

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
            .delete(`/api/groupbusinesscard/${myValue}/`, headers)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                alert("실패");
                console.log(error.response);
                throw error;
            });
    };

    return (
        <>
            <h1>그룹 명함첩</h1>
            <Link to="/GroupAdd">
                <Button variant="contained" color="primary" style={{ float: "right" }}>
                    그룹 등록
                </Button>
            </Link>
            <br />
            <br />
            <br />
            {
                // map 함수를 사용해서 group 데이터 뿌리기
                groupBcList.map((data, index) => (
                    <Card key={index} style={{ margin: "1rem" }}>
                        <Paper elevation={0} className={classes.title}>
                            {data.name}

                            <PopupState variant="popover" popupId="demo-popup-menu">
                                {(popupState) => (
                                    <React.Fragment>
                                        <SettingsIcon style={{ float: "right" }} {...bindTrigger(popupState)} />
                                        <Menu {...bindMenu(popupState)}>
                                            <Link
                                                to={`/GroupRename/${data.name}/${data.id}/${data.user_id}`}
                                                style={{ textDecoration: "none" }}
                                            >
                                                <MenuItem onClick={popupState.close}>그룹명 변경</MenuItem>
                                            </Link>

                                            <MenuItem onClick={handleGroupDelete} style={{ color: "red" }} data-my-value={data.id}>
                                                그룹 삭제
                                            </MenuItem>
                                        </Menu>
                                    </React.Fragment>
                                )}
                            </PopupState>
                        </Paper>

                        <CardContent>
                            <Paper>
                                <Grid item xs={12} className={classes.border_line}>
                                    <Paper className={classes.gbc_join}>
                                        참여중인 명함첩
                                        <Link to={`/CardBookAdd/${data.id}/${data.user_id}`} style={{ textDecoration: "none" }}>
                                            <Badge style={{ float: "right", right: "10px", color: "#9d9df7" }}>{"+ 명함첩 추가"}</Badge>
                                        </Link>
                                    </Paper>
                                </Grid>
                                {
                                    //그룹 아이디와 일치하는 명함첩 찾고 넣기
                                    bookBcList.map((bookData) => {
                                        if (data.id === bookData.group_id) {
                                            return (
                                                <>
                                                    <Grid container>
                                                        <Link to={`/GroupDetail/${bookData.id}`} style={{ textDecoration: "none" }}>
                                                            <Grid item xs={12}>
                                                                <AccountCircleIcon
                                                                    color="primary"
                                                                    style={{ fontSize: 80, float: "left" }}
                                                                />
                                                                <p className={classes.gcb_bcName}>{bookData.name}</p>
                                                            </Grid>
                                                        </Link>
                                                    </Grid>
                                                </>
                                            );
                                        }
                                        return null;
                                    })
                                }
                            </Paper>
                        </CardContent>
                    </Card>
                ))
            }
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </>
    );
}
