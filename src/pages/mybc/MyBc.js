import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import Fab from "@material-ui/core/Fab";
import Badge from "@material-ui/core/Badge";
import "./MyBc.css";
// import BcList from "./BcList";
// import {useBc} from '../../helpers/context/BcContext'
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SortIcon from "@material-ui/icons/Sort";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

//내 명함첩 , 메인페이지

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
        minWidth: 120,
    },
    formControl_text: {
        margin: theme.spacing(1),
        minWidth: 40,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    input: {
        display: "none",
    },
}));

export default function MyBc() {
    const [userSorting, setUserSorting] = useState("&ordering=-create_date");
    const [loading, setLoading] = useState(false);
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
                    .get(`/api/businesscard?user_id=${response.data.pk}&my_bc=1`, headers)
                    .then((response) => {
                        // 내명함인지 판단
                        response.data.forEach(function (data, idx) {
                            if (data.my_bc === true) {
                                setMybc(true);
                            }
                        });
                    })
                    .catch((error) => {
                        throw error;
                    });
                axios
                    .get(`/api/businesscard?user_id=${response.data.pk}&ocr_id_type=Success${userSorting}`, headers)
                    .then((response) => {
                        //로그인한 유저 데이터 호출 , sorting
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
                axios
                    .get(`/api/businesscardocr?user_id=${response.data.pk}&type=Unrecognizable`, headers)
                    .then((UnrecognizableResponse) => {
                        axios
                            .get(`/api/businesscardocr?user_id=${response.data.pk}&type=Recognizing`, headers)
                            .then((RecognizingResponse) => {
                                // 인식 실패 + 인식중 명함 개수 가져오기
                                setBcEntering(UnrecognizableResponse.data.length + RecognizingResponse.data.length);
                            })
                            .catch((error) => {
                                throw error;
                            });
                    })
                    .catch((error) => {
                        throw error;
                    });
            })
            .catch((error) => {
                throw error;
            });
    }, [history, userSorting]);

    const classes = useStyles();

    const [bcEntering, setBcEntering] = useState(1);

    const [bcList, setBcList] = useState([]);
    const [ocrList, setOcrList] = useState([]);
    const [mybc, setMybc] = useState(false);
    const [bcCheck, setBcCheck] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMyBcCheck = () => {
        setBcCheck(true);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //sorting
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
    const handleBcEdit = () => {
        history.push({
            pathname: "/BcEdit",
            state: { userSorting: userSorting },
        });
    };

    //명함인식DB로 이미지 보내기
    const handleChangeFile = (event) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            // 2. 읽기가 완료되면 아래코드가 실행됩니다.
            const base64 = reader.result;
            if (base64) {
                //경고창 없애기 위한 eslint 비활성화
                //eslint-disable-next-line
                const token = localStorage.getItem("userKey") && localStorage.getItem("userKey").replace(/\"/gi, "");
                //세션에 저장된 키 불러온뒤 ""제거
                const headers = {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                };
                //유저 키값을 가져온 뒤 ocrDB에 base64데이터 전송
                axios
                    .get("/api/rest-auth/user/", headers)
                    .then((response) => {
                        setLoading(true);
                        axios
                            .post(
                                `/api/businesscardocr/`,
                                {
                                    type: "Unrecognizable",
                                    user_id: response.data.pk,
                                    image: base64.toString(),
                                    my_bc: bcCheck,
                                },
                                headers
                            )
                            .then((ocrResponse) => {
                                //성공 시 인식 된 명함 가져오기
                                axios
                                    .get(`api/businesscardocr/${ocrResponse.data.id}`, headers)
                                    .then((getOcrResponse) => {
                                        if (getOcrResponse.data.type === "Unrecognizable") {
                                            setLoading(false);
                                            alert("인식불가");
                                        }
                                        if (getOcrResponse.data.type === "Recognizing") {
                                            setLoading(false);
                                            alert("인식률이 떨어집니다. 입력중으로 가서 직접입력해주세요");
                                        }
                                        setLoading(false);
                                        window.location.reload();
                                    })
                                    .catch((error) => {
                                        setLoading(false);
                                        throw error;
                                    });
                            })
                            .catch((error) => {
                                console.log(error.response);
                                setLoading(false);
                                throw error;
                            });
                    })
                    .catch((error) => {
                        setLoading(false);
                        throw error;
                    });
            }
        };
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        }
    };

    return (
        <>
            {loading && <CircularProgress color="secondary" style={{ marginLeft: "45%", margin: "40%", width: "10%" }} />}
            {!loading && (
                <>
                    <a href="https://deex.co.kr/">
                        <img className="Advertising" src={"/header_images/Ad.JPG"} alt={"광고"} />
                    </a>
                    <br />
                    <>
                        <Card className={classes.root}>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Link to="/BcEntering" style={{ textDecoration: "none" }}>
                                            <Paper className={classes.paper}>
                                                입력중인 명함
                                                <Badge
                                                    badgeContent={bcEntering}
                                                    color="error"
                                                    style={{ float: "right", top: "10px", right: "10px" }}
                                                ></Badge>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                    <br />
                                    <br />
                                    <br />

                                    <Grid item xs={12}>
                                        <Button
                                            startIcon={<CreateIcon />}
                                            style={{ float: "right", margin: "auto", textDecoration: "none" }}
                                            onClick={handleBcEdit}
                                        >
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

                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={handleRegistration}>등록일순</MenuItem>
                                            <MenuItem onClick={handleName}>이름순</MenuItem>
                                            <MenuItem onClick={handleCompany}>회사명순</MenuItem>
                                            <MenuItem onClick={handleInquiry}>최근 조회순</MenuItem>
                                            <MenuItem onClick={handleAddress}>지역별순</MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            {mybc !== true && (
                                <CardContent>
                                    <label htmlFor="icon-button-file" onClick={handleMyBcCheck}>
                                        <Paper className={classes.paper}>
                                            <Grid container>
                                                <Grid item xs={9} className={classes.text}>
                                                    본인의 명함을 입력하세요
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <RecentActorsIcon color="disabled" style={{ fontSize: 25 }} />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </label>
                                </CardContent>
                            )}

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
                                                        {data.ocr_id !== null &&
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
                                                                                margin: "2.5rem",
                                                                            }}
                                                                            src={ocrData.image}
                                                                            alt={"명함이미지" + ocrIndex}
                                                                        />
                                                                    )}
                                                                </>
                                                            ))}
                                                        {data.ocr_id === null && (
                                                            <RecentActorsIcon color="disabled" style={{ fontSize: 130 }} />
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Link>
                                    </CardContent>
                                ))
                            }
                        </Card>

                        <Fab
                            color="secondary"
                            aria-label="add"
                            style={{
                                float: "right",
                                position: "sticky",
                                margin: "1rem",
                                bottom: "80px",
                                display: "flex",
                            }}
                        >
                            {/* <input type="file" accept="image/*" capture="camera" /> */}
                            <input
                                accept="image/*"
                                capture="camera"
                                className={classes.input}
                                id="icon-button-file"
                                type="file"
                                onChange={handleChangeFile}
                            />
                            <label htmlFor="icon-button-file">
                                <IconButton color="inherit" aria-label="upload picture" component="span">
                                    <AddAPhotoIcon />
                                </IconButton>
                            </label>
                        </Fab>
                    </>
                </>
            )}
        </>
    );
}
