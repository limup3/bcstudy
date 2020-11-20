import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CreateIcon from "@material-ui/icons/Create";
import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

//입력중인 명함에서 입력불가 탭 목록

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

export default function Entering() {
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
            .get("https://bcbackend.azurewebsites.net/api/rest-auth/user/", headers)
            .then((response) => {
                axios
                    .get(`https://bcbackend.azurewebsites.net/api/businesscardocr?user_id=${response.data.pk}&type=Unrecognizable`, headers)
                    .then((response) => {
                        setBcList(response.data);
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

    const [edit, setEdit] = useState(false);
    const [bcList, setBcList] = useState([]);
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

    const handleDelete = () => {
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
                .delete(`https://bcbackend.azurewebsites.net/api/businesscardocr/${data.id}/`, headers)
                .then((response) => {
                    window.location.reload();
                    setEdit(false);
                })
                .catch((error) => {
                    alert("실패");
                    console.log(error.response);
                    throw error;
                });
        });
    };

    const editing = (items) => (
        <>
            {!edit && (
                <>
                    <Grid container>
                        <Grid item xs={12}>
                            <Button startIcon={<CreateIcon />} style={{ float: "right", marginTop: "25px" }} onClick={() => setEdit(true)}>
                                편집
                            </Button>
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    {
                        // map 함수를 사용해서 axios로 받은 데이터 뿌리기
                        bcList.map((data, i) => (
                            <Link to={`/EFDetail/${data.id}`} style={{ textDecoration: "none" }} key={i}>
                                <Paper elevation={1} style={{ position: "relative", right: "20px", bottom: "30px", marginLeft: "1rem" }}>
                                    <Grid item xs={12}>
                                        {data.image !== null && (
                                            <img
                                                style={{
                                                    width: "90px",
                                                    height: "auto",
                                                    maxWidth: "100px",
                                                    maxHeight: "50px",
                                                    float: "right",
                                                    margin: "0.4rem",
                                                }}
                                                src={data.image}
                                                alt={"명함이미지"}
                                            />
                                        )}

                                        <h3>연동 불가능</h3>
                                        <p style={{ color: "#b9b5b5", top: "10px" }}>{data.update_date.substring(0, 10)}</p>
                                    </Grid>
                                </Paper>
                            </Link>
                        ))
                    }
                </>
            )}

            {edit && (
                <>
                    <Grid container>
                        <Grid item xs={10}>
                            <Tooltip title="전체선택">
                                <FormControl className={classes.formControl} style={{ top: "10px", right: "15px" }}>
                                    <GreenCheckbox
                                        onClick={handleToggleAll(items)}
                                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                                        disabled={items.length === 0}
                                        inputProps={{ "aria-label": "all items selected" }}
                                        style={{ right: "50%" }}
                                    />
                                </FormControl>
                            </Tooltip>

                            <Button style={{ right: "40%", top: "25%" }}>{`${numberOfChecked(items)} 개 선택됨`}</Button>
                        </Grid>

                        <Grid item xs={2}>
                            <FormControl className={classes.formControl_text} onClick={() => setEdit(false)}>
                                <InputLabel htmlFor="age-native-simple">
                                    <Button startIcon={<CloseIcon />} size="small" style={{ top: "5px", right: "5px" }}>
                                        취소
                                    </Button>
                                </InputLabel>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <List>
                        {items.map((value, a) => {
                            const labelId = `transfer-list-all-item-${value}-label`;

                            return (
                                <>
                                    <Grid container key={a}>
                                        <Grid item xs={1}>
                                            <ListItem
                                                key={value}
                                                role="listitem"
                                                onClick={handleToggle(value)}
                                                style={{ position: "relative", right: "20px", bottom: "50px", width: "100%" }}
                                            >
                                                <GreenCheckbox
                                                    style={{ top: "40px", right: "13px" }}
                                                    edge="start"
                                                    checked={checked.indexOf(value) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ "aria-labelledby": labelId }}
                                                />
                                            </ListItem>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Paper
                                                elevation={1}
                                                style={{ position: "relative", right: "20px", bottom: "30px", width: "100%" }}
                                            >
                                                <Grid item xs={12}>
                                                    {value.image !== null && (
                                                        <img
                                                            style={{
                                                                width: "90px",
                                                                height: "auto",
                                                                maxWidth: "100px",
                                                                maxHeight: "50px",
                                                                float: "right",
                                                                margin: "0.4rem",
                                                            }}
                                                            src={value.image}
                                                            alt={"명함이미지"}
                                                        />
                                                    )}

                                                    <h3>연동 불가능</h3>
                                                    <p style={{ color: "#b9b5b5", top: "10px" }}>{value.update_date.substring(0, 10)}</p>
                                                </Grid>
                                            </Paper>
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
                            backgroundColor: "black",
                        }}
                        onClick={handleDelete}
                    >
                        삭제
                    </Button>
                </>
            )}
        </>
    );
    return <>{editing(bcList)}</>;
}
