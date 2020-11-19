import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useLocation, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
// import {useBc} from '../../helpers/context/BcContext'
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { green } from "@material-ui/core/colors";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import CardContent from "@material-ui/core/CardContent";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

// 명함 가져오기
// 그룹 등록으로 인한 명함 가져오기와 GroupDetail에서 내 명함첩 가져오기 두 파일에서 호출

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        marginBottom: "40px",
        minWidth: 120,
    },
}));

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        "&$checked": {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function BcImport() {
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
            .get("/api/rest-auth/user/", headers)
            .then((response) => {
                // 유저 키값 호출
                axios
                    .get(`/api/businesscard?user_id=${response.data.pk}`, headers)
                    .then((response) => {
                        //로그인한 유저 데이터 호출
                        setBcList(response.data);
                    })
                    .catch((error) => {
                        throw error;
                    });
                axios
                    .get(`/api/businesscardocr?user_id=${response.data.pk}&type=Success`, headers)
                    .then((response) => {
                        // 로그인한 유저 ocr데이터 호출
                        setOcrList(response.data);
                    })
                    .catch((error) => {
                        throw error;
                    });
            })
            .catch((error) => {
                throw error;
            });
    }, [history]);

    const classes = useStyles();

    // const bcData = useBc()

    // const [edit] = useState(true)
    // 편집일때와 아닐때 분류

    const [checked, setChecked] = React.useState([]);

    const [bcList, setBcList] = useState([]);
    const [ocrList, setOcrList] = useState([]);
    //axios로 받은 데이터 저장

    const location = useLocation();

    const handleBack = (e) => {
        e.preventDefault();

        if (location.state !== undefined) {
            history.push({
                pathname: "/MyBc",
                state: { FooterValue: 1 },
            });
        } else {
            history.goBack();
        }
    };

    //풋터 인덱스 관리

    const handleComplete = () => {
        checked.forEach(function (data, idx) {
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
                    //location값으로 어디서 왔는지 분류
                    //GroupAddNext -> BcImport
                    if (location.state.addBookId) {
                        axios
                            .put(
                                `/api/businesscard/${data.id}/`,
                                {
                                    book_id: location.state.addBookId,
                                    my_bc: data.my_bc,
                                    user_id: response.data.pk,
                                },
                                headers
                            )
                            .then((response) => {})
                            .catch((error) => {
                                alert("실패");
                                console.log(error.response);
                                throw error;
                            });
                    }
                    //location값으로 어디서 왔는지 분류
                    //GroupDetail -> BcImport
                    else if (location.state.BookId) {
                        axios
                            .put(
                                `/api/businesscard/${data.id}/`,
                                {
                                    book_id: location.state.BookId,
                                    my_bc: data.my_bc,
                                    user_id: response.data.pk,
                                },
                                headers
                            )
                            .then((response) => {})
                            .catch((error) => {
                                alert("실패");
                                console.log(error.response);
                                throw error;
                            });
                    }
                })
                .catch((error) => {
                    throw error;
                });
        });
        if (location.state !== undefined) {
            history.push({
                pathname: "/MyBc",
                state: { FooterValue: 1 },
            });
        } else {
            history.goBack();
        }
    };
    //체크박스 관리
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const editing = (items) => (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Paper elevation={0}>
                        <CloseIcon style={{ marginLeft: "10px", float: "left", fontSize: 35 }} onClick={handleBack} />
                        <h1 style={{ margin: "1rem", marginLeft: "50px" }}>내 명함첩에서 가져오기</h1>
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    <Tooltip title="전체선택">
                        <FormControl className={classes.formControl} style={{ top: "10px" }}>
                            <GreenCheckbox
                                onClick={handleToggleAll(items)}
                                checked={numberOfChecked(items) === items.length && items.length !== 0}
                                indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                                disabled={items.length === 0}
                                inputProps={{ "aria-label": "all items selected" }}
                                style={{ right: "40%" }}
                            />
                        </FormControl>
                    </Tooltip>
                    <Button style={{ right: "30%", top: "25%" }}>{`${numberOfChecked(items)} 개 선택됨`}</Button>
                </Grid>

                <Grid item xs={3}>
                    <FormControl className={classes.formControl_text} style={{ left: "13px" }}>
                        <InputLabel htmlFor="age-native-simple">
                            <Button size="small" startIcon={<DoneIcon />} style={{ color: "green" }} onClick={handleComplete}>
                                완료
                            </Button>
                        </InputLabel>
                    </FormControl>
                </Grid>
            </Grid>

            <List>
                {items.map((value, i) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <>
                            <Grid container>
                                <Grid item xs={1}>
                                    <ListItem
                                        key={value}
                                        role="listitem"
                                        onClick={handleToggle(value)}
                                        style={{ position: "relative", right: "20px", bottom: "50px", width: "100%" }}
                                    >
                                        <GreenCheckbox
                                            style={{ top: "160px", left: "20px" }}
                                            edge="start"
                                            checked={checked.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ "aria-labelledby": labelId }}
                                        />
                                    </ListItem>
                                </Grid>
                                <Grid item xs={11}>
                                    <CardContent key={i}>
                                        <p style={{ color: "#969595" }}>{value.create_date.substring(0, 10)}</p>
                                        <Paper className={classes.paper}>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <h2>{value.name}</h2>
                                                    <p>{value.position}</p>
                                                    <p>{value.company_name}</p>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {value.ocr_id !== null && // ocr_id fk키를 이용하여 이미지 가져오기
                                                        ocrList.map((editOcrData, editOcrIndex) => (
                                                            <>
                                                                {value.ocr_id === editOcrData.id && editOcrData.image !== null && (
                                                                    <img
                                                                        key={editOcrIndex}
                                                                        style={{
                                                                            width: "auto",
                                                                            height: "auto",
                                                                            maxWidth: "100px",
                                                                            maxHeight: "90px",
                                                                            float: "right",
                                                                            margin: "2rem",
                                                                            marginRight: "1rem",
                                                                        }}
                                                                        src={editOcrData.image}
                                                                        alt={"명함이미지"}
                                                                    />
                                                                )}
                                                            </>
                                                        ))}
                                                    {value.ocr_id === null && (
                                                        <RecentActorsIcon color="disabled" style={{ fontSize: 130 }} />
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </>
                    );
                })}
            </List>

            <Button
                variant="contained"
                fullWidth
                style={{
                    position: "fixed",
                    bottom: "0",
                    height: "7%",
                    width: "100%",
                    right: "1px",
                    color: "white",
                    backgroundColor: "#63cc63",
                }}
                onClick={handleComplete}
            >
                만들기
            </Button>
        </>
    );

    return <>{editing(bcList)}</>;
}
