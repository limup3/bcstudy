import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import Badge from "@material-ui/core/Badge";
import "./MyBc.css";
// import BcList from "./BcList";
import { EditFooter } from "../../components";
// import {useBc} from '../../helpers/context/BcContext'
import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

//내 명함첩에서 편집클릭시 나오는 화면

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        minWidth: 275,
    },
    text: {
        fontSize: 14,
        color: "gray",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "left",
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        marginTop: "5%",
        minWidth: 120,
    },
    formControl_text: {
        margin: theme.spacing(1),
        minWidth: 40,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
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

export default function BcEdit() {
    const location = useLocation();
    const history = useHistory();
    const [userSorting, setUserSorting] = useState("&ordering=-create_date");
    useEffect(() => {
        setUserSorting(location.state && location.state.userSorting);
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
                //Mybc에서 정렬한 데이터 넘겨줘서 편집모드에서도 데이터 정렬한형태로 보여주기
                axios
                    .get(`/api/businesscard?user_id=${response.data.pk}${userSorting}`, headers)
                    .then((response) => {
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
    }, [history, userSorting, location.state]);
    //실행되자마자 유저의 아이디값을 가져오고 유저의 아이디값인 명함목록 가져오기

    const classes = useStyles();

    const [bcEntering] = useState(1);
    const [bcList, setBcList] = useState([]);
    const [ocrList, setOcrList] = useState([]);
    const [checked, setChecked] = React.useState([]);

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
            <EditFooter checked={checked} />

            <a href="https://deex.co.kr/">
                <img className="Advertising" src={"/header_images/Ad.JPG"} alt={"광고"} />
            </a>
            <br />

            <Card className={classes.root}>
                <CardContent>
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                입력중인 명함
                                <Badge
                                    badgeContent={bcEntering}
                                    color="error"
                                    style={{ float: "right", top: "10px", right: "10px" }}
                                ></Badge>
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

                            <Button style={{ right: "30%", top: "40%" }}>{`${numberOfChecked(items)} 개 선택됨`}</Button>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl className={classes.formControl_text} style={{ left: "13px" }}>
                                <InputLabel htmlFor="age-native-simple">
                                    <Link to="/MyBc" style={{ textDecoration: "none" }}>
                                        <Button startIcon={<CloseIcon />} size="small">
                                            취소
                                        </Button>
                                    </Link>
                                </InputLabel>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>

                <List className={classes.root}>
                    {items.map((value, i) => {
                        const labelId = `transfer-list-all-item-${value}-label`;

                        return (
                            <>
                                <Grid container>
                                    <Grid item xs={1}>
                                        <ListItem key={value} role="listitem" onClick={handleToggle(value)}>
                                            <GreenCheckbox
                                                style={{ top: "120px" }}
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
                                                                                margin: "2.5rem",
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
            </Card>
        </>
    );
    return <>{editing(bcList)}</>;
}
