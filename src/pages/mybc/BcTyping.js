import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import { useLocation, useHistory } from "react-router-dom";
import { useBc, useSetBc } from "../../helpers/context/BcContext";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import BookmarkIcon from "@material-ui/icons/Bookmark";

//명함 직접입력

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
    },
    margin: {
        margin: theme.spacing(2),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: "25ch",
    },
    input: {
        display: "none",
    },
}));

export default function BcTyping() {
    const setBcData = useSetBc();
    const bcData = useBc();
    useEffect(() => {
        // set으로 데이터 갱신
        setBcData.setbcinformation.setBcName("");
        setBcData.setbcinformation.setBcPosition("");
        setBcData.setbcinformation.setBcDepartment("");
        setBcData.setbcinformation.setBcCompany("");
        setBcData.setbcinformation.setBcMobile("");
        setBcData.setbcinformation.setBcPhone("");
        setBcData.setbcinformation.setBcDirect("");
        setBcData.setbcinformation.setBcFax("");
        setBcData.setbcinformation.setBcEmail("");
        setBcData.setbcinformation.setBcAddr("");
        setBcData.setbcinformation.setBcEName("");
        setBcData.setbcinformation.setBcECompany("");
        setBcData.setbcinformation.setBcEPosition("");
        setBcData.setbcinformation.setBcEDepartment("");
        setBcData.setbcinformation.setBcEAddr("");
    }, []);
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
                setUser_id(response.data.pk);
            })
            .catch((error) => {
                throw error;
            });
    }, [history]);

    const classes = useStyles();

    const [user_id, setUser_id] = useState();
    const [validBcName, setValidBcName] = useState("");

    const location = useLocation();

    const handleBack = (e) => {
        e.preventDefault();

        if (location.state !== undefined) {
            if (location.state.value === "Detail") {
                history.push({
                    pathname: "/MyBc",
                    state: { FooterValue: 4 },
                });
            } else if (location.state.value === "MyBc") {
                history.push({
                    pathname: "/MyBc",
                    state: { FooterValue: 0 },
                });
            } else if (location.state.value === "EFDetail") {
                history.push({
                    pathname: `/EFDetail/${location.state.ocrId}`,
                    // state: { EnteringValue: 1 },
                });
            }
        }
    };
    //경고창 없애기 위한 eslint 비활성화
    //eslint-disable-next-line
    const token = localStorage.getItem("userKey") && localStorage.getItem("userKey").replace(/\"/gi, "");
    //세션에 저장된 키 불러온뒤 ""제거

    const handleComplete = (e) => {
        if (bcData.bcinformation.bcName !== "") {
            e.preventDefault();

            const headers = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            };
            const ocrJson = {
                image: "",
                type: "Success",
                user_id: user_id,
            };
            axios
                .post(`https://bcbackend.azurewebsites.net/api/businesscardocr/`, ocrJson, headers)
                .then((response) => {
                    axios
                        .post(
                            "https://bcbackend.azurewebsites.net/api/businesscard/",
                            {
                                name: bcData.bcinformation.bcName,
                                company_name: bcData.bcinformation.bcCompany,
                                position: bcData.bcinformation.bcPosition,
                                department: bcData.bcinformation.bcDepartment,
                                direct: bcData.bcinformation.bcDirect,
                                phone: bcData.bcinformation.bcPhone,
                                mobile: bcData.bcinformation.bcMobile,
                                fax: bcData.bcinformation.bcFax,
                                email: bcData.bcinformation.bcEmail,
                                address: bcData.bcinformation.bcAddr,
                                eng_name: bcData.bcinformation.bcEName,
                                eng_company_name: bcData.bcinformation.bcECompany,
                                eng_position: bcData.bcinformation.bcEPosition,
                                eng_deptment: bcData.bcinformation.bcEDepartment,
                                eng_address: bcData.bcinformation.bcEAddr,
                                my_bc: false,
                                user_id: user_id,
                                ocr_id: response.data.id,
                            },
                            headers
                        )
                        .then((response) => {
                            if (location.state !== undefined) {
                                if (location.state.value === "Detail") {
                                    history.push({
                                        pathname: "/MyBc",
                                        state: { FooterValue: 0 },
                                    });
                                } else if (location.state.value === "MyBc") {
                                    history.push({
                                        pathname: "/MyBc",
                                        state: { FooterValue: 0 },
                                    });
                                }
                            }
                        })
                        .catch((error) => {
                            alert("실패");
                            console.log(error.response.data);
                            if (error.response.data.name !== undefined) {
                                setValidBcName(error.response.data.name);
                            } else {
                                setValidBcName("");
                            }
                            throw error;
                        });
                })
                .catch((error) => {
                    throw error;
                });
        } else {
            alert("이름을 입력해주세요");
        }
    };
    const handleDrafts = (e) => {
        if (bcData.bcinformation.bcName !== "") {
            e.preventDefault();

            const headers = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            };
            const ocrJson = {
                image: "",
                type: "Recognizing",
                user_id: user_id,
            };
            axios
                .post(`https://bcbackend.azurewebsites.net/api/businesscardocr/`, ocrJson, headers)
                .then((response) => {
                    axios
                        .post(
                            "https://bcbackend.azurewebsites.net/api/businesscard/",
                            {
                                name: bcData.bcinformation.bcName,
                                company_name: bcData.bcinformation.bcCompany,
                                position: bcData.bcinformation.bcPosition,
                                department: bcData.bcinformation.bcDepartment,
                                direct: bcData.bcinformation.bcDirect,
                                phone: bcData.bcinformation.bcPhone,
                                mobile: bcData.bcinformation.bcMobile,
                                fax: bcData.bcinformation.bcFax,
                                email: bcData.bcinformation.bcEmail,
                                address: bcData.bcinformation.bcAddr,
                                eng_name: bcData.bcinformation.bcEName,
                                eng_company_name: bcData.bcinformation.bcECompany,
                                eng_position: bcData.bcinformation.bcEPosition,
                                eng_deptment: bcData.bcinformation.bcEDepartment,
                                eng_address: bcData.bcinformation.bcEAddr,
                                my_bc: false,
                                user_id: user_id,
                                ocr_id: response.data.id,
                            },
                            headers
                        )
                        .then((response) => {
                            if (location.state !== undefined) {
                                if (location.state.value === "Detail") {
                                    history.push({
                                        pathname: "/MyBc",
                                        state: { FooterValue: 0 },
                                    });
                                } else if (location.state.value === "MyBc") {
                                    history.push({
                                        pathname: "/MyBc",
                                        state: { FooterValue: 0 },
                                    });
                                }
                            }
                        })
                        .catch((error) => {
                            alert("실패");
                            console.log(error.response.data);
                            if (error.response.data.name !== undefined) {
                                setValidBcName(error.response.data.name);
                            } else {
                                setValidBcName("");
                            }
                            throw error;
                        });
                })
                .catch((error) => {
                    console.log(error.response.data);
                    throw error;
                });
        } else {
            alert("이름을 입력해주세요");
        }
    };

    const [loading, setLoading] = useState(false);
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
                    .get("https://bcbackend.azurewebsites.net/api/rest-auth/user/", headers)
                    .then((response) => {
                        setLoading(true);
                        axios
                            .post(
                                `https://bcbackend.azurewebsites.net/api/businesscardocr/`,
                                {
                                    type: "Recognizing",
                                    user_id: response.data.pk,
                                    image: base64.toString(),
                                    my_bc: false,
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
                                        history.push("/Mybc");
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
            {loading && <CircularProgress color="secondary" style={{ marginLeft: "45%", margin: "45%", width: "10%" }} />}
            {!loading && (
                <>
                    <form className={classes.root} noValidate autoComplete="off">
                        <Grid container>
                            <Grid item xs={6}>
                                <Paper elevation={0}>
                                    <ArrowBackIosIcon
                                        style={{ marginLeft: "10px", marginBottom: "10px", float: "left", fontSize: 25 }}
                                        onClick={handleBack}
                                    />
                                    <h2 style={{ margin: "1rem", marginLeft: "50px" }}>직접입력</h2>
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    startIcon={<DoneIcon />}
                                    style={{ float: "right", marginTop: "15px", color: "green" }}
                                    onClick={handleComplete}
                                >
                                    완료
                                </Button>
                                <Button
                                    startIcon={<BookmarkIcon />}
                                    style={{ float: "right", marginTop: "15px", color: "#ff7e7e" }}
                                    onClick={handleDrafts}
                                >
                                    임시저장
                                </Button>
                            </Grid>

                            <Grid container>
                                <FormControl style={{ width: "65%" }} className={classes.margin}>
                                    <InputLabel>이름</InputLabel>
                                    <Input
                                        error={validBcName !== "" ? true : false}
                                        // helpertext={validBcName}
                                        value={bcData.bcinformation.bcName}
                                        onChange={(e) => setBcData.setbcinformation.setBcName(e.target.value)}
                                        aria-describedby="component-error-text"
                                    />
                                    <FormHelperText id="component-error-text" style={{ color: "red" }}>
                                        {validBcName}
                                    </FormHelperText>
                                </FormControl>
                                <Grid item xs={3}>
                                    <AccountCircleIcon
                                        color="disabled"
                                        style={{ fontSize: 50, float: "right", marginTop: "15px", padding: "0.5rem" }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>직책</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcPosition}
                                onChange={(e) => setBcData.setbcinformation.setBcPosition(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>부서</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcDepartment}
                                onChange={(e) => setBcData.setbcinformation.setBcDepartment(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>회사</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcCompany}
                                onChange={(e) => setBcData.setbcinformation.setBcCompany(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>휴대폰</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcMobile}
                                onChange={(e) => setBcData.setbcinformation.setBcMobile(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>유선전화</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcPhone}
                                onChange={(e) => setBcData.setbcinformation.setBcPhone(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>직통번호</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcDirect}
                                onChange={(e) => setBcData.setbcinformation.setBcDirect(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>팩스</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcFax}
                                onChange={(e) => setBcData.setbcinformation.setBcFax(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>이메일</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcEmail}
                                onChange={(e) => setBcData.setbcinformation.setBcEmail(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>주소</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcAddr}
                                onChange={(e) => setBcData.setbcinformation.setBcAddr(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>영문 이름</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcEName}
                                onChange={(e) => setBcData.setbcinformation.setBcEName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>영문 회사명</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcECompany}
                                onChange={(e) => setBcData.setbcinformation.setBcECompany(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>영문 직책</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcEPosition}
                                onChange={(e) => setBcData.setbcinformation.setBcEPosition(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>영문 부서</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcEDepartment}
                                onChange={(e) => setBcData.setbcinformation.setBcEDepartment(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>영문 주소</InputLabel>
                            <Input
                                value={bcData.bcinformation.bcEAddr}
                                onChange={(e) => setBcData.setbcinformation.setBcEAddr(e.target.value)}
                            />
                        </FormControl>
                    </form>

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
            )}
        </>
    );
}
