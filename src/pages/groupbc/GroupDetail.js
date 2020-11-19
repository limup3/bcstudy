import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useBc } from "../../helpers/context/BcContext";
import Button from "@material-ui/core/Button";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SortIcon from "@material-ui/icons/Sort";
import CreateIcon from "@material-ui/icons/Create";
import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import CardContent from "@material-ui/core/CardContent";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import { useHistory } from "react-router-dom";
import axios from "axios";

//그룹 상세정보

const useStyles = makeStyles((theme) => ({
    input: {
        display: "none",
    },
    formControl: {
        margin: theme.spacing(1),
        // marginBottom: '40px',
        // marginTop:'20px',
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

export default function GroupDetail({ match }) {
    const [userSorting, setUserSorting] = useState("");
    const [ocrList, setOcrList] = useState([]);
    const [userId, setUserId] = useState("");
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
        //명함첩에 등록된 데이터 호출하는 axios
        axios
            .get(`/api/businesscard?book_id=${match.params.id}${userSorting}`, headers)
            .then((response) => {
                setBcList(response.data);
            })
            .catch((error) => {
                throw error;
            });
        //OCR 이미지 가져오기 위해 데이터 호출하는 axios
        axios
            .get("/api/rest-auth/user/", headers)
            .then((response) => {
                setUserId(response.data.pk);
                axios
                    .get(`/api/businesscardocr?user_id=${response.data.pk}&type=Success`, headers)
                    .then((response) => {
                        setOcrList(response.data);
                    })
                    .catch((error) => {
                        throw error;
                    });
            })
            .catch((error) => {
                throw error;
            });
    }, [history, match.params.id, userSorting]);

    const classes = useStyles();
    const bcData = useBc();
    const [bcList, setBcList] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [edit, setEdit] = useState(false);

    const [checked, setChecked] = React.useState([]);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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

    const handleImport = () => {
        history.push({
            pathname: "/BcImport",
            state: { BookId: match.params.id },
        });
    };

    //Sorting

    const handleRegistration = () => {
        setAnchorEl(null);
        setUserSorting("&ordering=-create_date");
    };
    const handleName = () => {
        setAnchorEl(null);
        setUserSorting("&ordering=name");
    };
    const handleCompany = () => {
        setAnchorEl(null);
        setUserSorting("&ordering=company_name");
    };
    const handleInquiry = () => {
        setAnchorEl(null);
        setUserSorting("&ordering=-inquiry_date");
    };
    const handleAddress = () => {
        setAnchorEl(null);
        setUserSorting("&ordering=address");
    };

    const handleDelete = () => {
        // 체크박스 항목을 foreach로 돌린 뒤 book_id 검색 ,
        // 이후 book_id의 아이디값을 검색하여 bokk_id를 null값으로 변환 (null일시 명함첩에 있는 명함은
        // 삭제된다, 필터링한 검색(book_id=${data.book_id)에서 삭제 불가능으로 id값을 찾는걸로 해결)

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
                .get(`/api/businesscard/?book_id=${data.book_id}`, headers)
                .then((response) => {
                    response.data.forEach(function (data2, idx) {
                        if (data.id === data2.id) {
                            axios
                                .put(`/api/businesscard/${data2.id}/`, { book_id: null, my_bc: false, user_id: data2.user_id }, headers)

                                .then((response) => {
                                    history.push({
                                        pathname: "/MyBc",
                                        state: { FooterValue: 1 },
                                    });
                                })
                                .catch((error) => {
                                    alert("실패");
                                    console.log(error.response);
                                    throw error;
                                });
                        }
                    });
                })
                .catch((error) => {
                    throw error;
                });
        });
    };

    const handleBookDelete = () => {
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
            .delete(`/api/businesscardbook/${match.params.id}/`, headers)
            .then((response) => {
                history.push({
                    pathname: "/MyBc",
                    state: { FooterValue: 1 },
                });
            })
            .catch((error) => {
                alert("실패");
                console.log(error.response);
                throw error;
            });
    };

    const editing = (items) => (
        <>
            <Grid container>
                <Grid item xs={7}>
                    <Paper elevation={0}>
                        <ArrowBackIosIcon style={{ marginLeft: "10px", float: "left", fontSize: 35 }} onClick={bcData.handleBack} />
                        <h1 style={{ margin: "1rem", marginLeft: "50px" }}>명함첩</h1>
                    </Paper>
                </Grid>
                <Grid item xs={5}>
                    <Button
                        startIcon={<DeleteOutlineIcon />}
                        style={{ float: "right", marginTop: "15px", color: "red" }}
                        onClick={handleBookDelete}
                    >
                        삭제
                    </Button>
                    {/* <Link
                                                to={`/GroupBcRename/${data.id}/${data.user_id}`}
                                                style={{ textDecoration: "none", color: "purple" }}
                                            >
                                                <MenuItem onClick={popupState.close}>명함첩명 변경</MenuItem>
                                            </Link> */}
                    <Link to={`/GroupBcRename/${match.params.id}/${userId}`} style={{ textDecoration: "none" }}>
                        <Button startIcon={<EditIcon />} style={{ float: "right", marginTop: "15px" }}>
                            이름변경
                        </Button>
                    </Link>
                </Grid>
            </Grid>
            {/* <h4 style={{ marginLeft: "8%" }}>명함첩</h4> */}
            <hr />
            <Button fullWidth style={{ backgroundColor: "#fdfafa" }} onClick={handleImport}>
                {"+ 내 명함첩에서 가져오기"}
            </Button>
            <hr />
            {!edit && (
                <>
                    <br />
                    <Grid item xs={12}>
                        <Button startIcon={<CreateIcon />} style={{ float: "right", margin: "auto" }} onClick={() => setEdit(true)}>
                            편집
                        </Button>
                        <Button
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            style={{ float: "right" }}
                            startIcon={<SortIcon />}
                        >
                            명함정렬
                        </Button>
                        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={handleRegistration}>등록일순</MenuItem>
                            <MenuItem onClick={handleName}>이름순</MenuItem>
                            <MenuItem onClick={handleCompany}>회사명순</MenuItem>
                            <MenuItem onClick={handleInquiry}>최근 조회순</MenuItem>
                            <MenuItem onClick={handleAddress}>지역별순</MenuItem>
                        </Menu>
                    </Grid>
                    <br />
                    <br />

                    {
                        // map 함수를 사용해서 axios로 받은 데이터 뿌리기
                        bcList.map((data, i) => (
                            <CardContent key={i}>
                                <p style={{ color: "#969595" }}>{data.create_date.substring(0, 10)}</p>
                                <Link to={`/BcDetail/${data.id}`} style={{ textDecoration: "none" }}>
                                    <Paper className={classes.paper}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <h2>{data.name}</h2>
                                                <p>{data.position}</p>
                                                <p>{data.company_name}</p>
                                            </Grid>
                                            <Grid item xs={6}>
                                                {data.ocr_id !== null && //ocr 이미지 가져오기
                                                    ocrList.map((ocrData, ocrIndex) => (
                                                        <>
                                                            {data.ocr_id === ocrData.id && ocrData.image !== null && (
                                                                <img
                                                                    key={ocrIndex}
                                                                    style={{
                                                                        width: "auto",
                                                                        height: "auto",
                                                                        maxWidth: "100px",
                                                                        maxHeight: "90px",
                                                                        float: "right",
                                                                        margin: "2rem",
                                                                        marginRight: "1rem",
                                                                    }}
                                                                    src={ocrData.image}
                                                                    alt={"명함이미지"}
                                                                />
                                                            )}
                                                        </>
                                                    ))}
                                                {data.ocr_id === null && <RecentActorsIcon color="disabled" style={{ fontSize: 130 }} />}
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Link>
                            </CardContent>
                        ))
                    }
                </>
            )}
            {edit && (
                <>
                    <Grid container>
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

                            <Button style={{ right: "30%", top: "35%" }}>{`${numberOfChecked(items)} 개 선택됨`}</Button>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl className={classes.formControl_text} style={{ left: "35px" }} onClick={() => setEdit(false)}>
                                <InputLabel htmlFor="age-native-simple">
                                    <Button startIcon={<CloseIcon />} size="small">
                                        취소
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
                                                    style={{ top: "180px", left: "10px" }}
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
