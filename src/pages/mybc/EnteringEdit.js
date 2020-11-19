import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import { useBc, useSetBc } from "../../helpers/context/BcContext";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import axios from "axios";

//명함 상세페이지 편집

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
    },
    margin: {
        margin: theme.spacing(2),
    },
}));

export default function EnteringEdit({ match }) {
    const history = useHistory();
    const classes = useStyles();
    const bcData = useBc();
    const setBcData = useSetBc();
    const [id, setId] = useState(0);
    const [user_id, setUser_Id] = useState(0);
    const [my_bc, setMy_bc] = useState(false);

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
            .get(`/api/businesscard?ocr_id=${match.params.id}`, headers)
            .then((response) => {
                //bccard 테이블에서 ocrid가 일치하는 데이터 찾기
                axios
                    .get(`/api/businesscard/${response.data[0].id}/`, headers)
                    .then((response) => {
                        //찾았으면 데이터 가져오기
                        setId(response.data.id);
                        setUser_Id(response.data.user_id);
                        setMy_bc(response.data.my_bc);
                        setBcData.setbcinformation.setBcName(response.data.name);
                        setBcData.setbcinformation.setBcPosition(response.data.position);
                        setBcData.setbcinformation.setBcDepartment(response.data.department);
                        setBcData.setbcinformation.setBcCompany(response.data.company_name);
                        setBcData.setbcinformation.setBcMobile(response.data.mobile);
                        setBcData.setbcinformation.setBcPhone(response.data.phone);
                        setBcData.setbcinformation.setBcDirect(response.data.direct);
                        setBcData.setbcinformation.setBcFax(response.data.fax);
                        setBcData.setbcinformation.setBcEmail(response.data.email);
                        setBcData.setbcinformation.setBcAddr(response.data.address);
                        setBcData.setbcinformation.setBcEName(response.data.eng_name);
                        setBcData.setbcinformation.setBcECompany(response.data.eng_company_name);
                        setBcData.setbcinformation.setBcEPosition(response.data.eng_position);
                        setBcData.setbcinformation.setBcEDepartment(response.data.eng_deptment);
                        setBcData.setbcinformation.setBcEAddr(response.data.eng_address);
                    })
                    .catch((error) => {
                        throw error;
                    });
            })
            .catch((error) => {
                throw error;
            });
    }, [history, match.params.id]);
    const handleComplete = () => {
        //경고창 없애기 위한 eslint 비활성화
        //eslint-disable-next-line
        const token = localStorage.getItem("userKey") && localStorage.getItem("userKey").replace(/\"/gi, "");
        //세션에 저장된 키 불러온뒤 ""제거
        const headers = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };
        const bcJson = {
            name: bcData.bcinformation.bcName,
            company_name: bcData.bcinformation.bcCompany,
            department: bcData.bcinformation.bcDepartment,
            position: bcData.bcinformation.bcPosition,
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
            my_bc: my_bc,
            user_id: user_id,
        };
        const ocrJson = {
            type: "Success",
        };

        axios
            .put(`/api/businesscard/${id}/`, bcJson, headers)
            .then((response) => {
                axios
                    .patch(`/api/businesscardocr/${match.params.id}/`, ocrJson, headers)
                    .then((response) => {
                        history.goBack();
                    })
                    .catch((error) => {
                        alert("실패");
                        console.log(error.response);
                        throw error;
                    });
            })
            .catch((error) => {
                alert("실패");
                console.log(error.response);
                throw error;
            });
    };

    const handleDelete = () => {
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
            .delete(`/api/businesscardocr/${match.params.id}/`, headers)
            .then((response) => {
                history.push("/Mybc");
            })
            .catch((error) => {
                alert("실패");
                console.log(error.response);
                throw error;
            });
    };

    return (
        <>
            <form className={classes.root} noValidate autoComplete="off">
                <Grid container>
                    <Grid item xs={7}>
                        <Paper elevation={0}>
                            <ArrowBackIosIcon
                                style={{ marginLeft: "10px", marginBottom: "10px", float: "left", fontSize: 25 }}
                                onClick={bcData.handleBack}
                            />
                            <h2 style={{ margin: "1rem", marginLeft: "50px" }}>명함 정보 편집</h2>
                        </Paper>
                    </Grid>
                    <Grid item xs={5}>
                        <Button
                            startIcon={<DoneIcon />}
                            style={{ float: "right", marginTop: "15px", color: "green" }}
                            onClick={handleComplete}
                        >
                            완료
                        </Button>
                        <Button
                            startIcon={<DeleteOutlineIcon />}
                            style={{ float: "right", marginTop: "15px", color: "red" }}
                            onClick={handleDelete}
                        >
                            삭제
                        </Button>
                    </Grid>
                    {/* <img style={{ marginLeft: "auto", marginRight: "auto", width: "95%" }} src={"/images/Bc.PNG"} alt={"명함사진"} /> */}
                </Grid>
                <Grid container>
                    <FormControl style={{ width: "60%" }} className={classes.margin}>
                        <InputLabel>이름</InputLabel>
                        <Input
                            // helpertext={validBcName}
                            value={bcData.bcinformation.bcName}
                            onChange={(e) => setBcData.setbcinformation.setBcName(e.target.value)}
                        />
                    </FormControl>
                    <Grid item xs={3}>
                        <AccountCircleIcon
                            color="disabled"
                            style={{ fontSize: 50, float: "right", marginTop: "15px", padding: "0.5rem" }}
                        />
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
                    <Input value={bcData.bcinformation.bcMobile} onChange={(e) => setBcData.setbcinformation.setBcMobile(e.target.value)} />
                </FormControl>

                <FormControl fullWidth className={classes.margin}>
                    <InputLabel>유선전화</InputLabel>
                    <Input value={bcData.bcinformation.bcPhone} onChange={(e) => setBcData.setbcinformation.setBcPhone(e.target.value)} />
                </FormControl>

                <FormControl fullWidth className={classes.margin}>
                    <InputLabel>직통번호</InputLabel>
                    <Input value={bcData.bcinformation.bcDirect} onChange={(e) => setBcData.setbcinformation.setBcDirect(e.target.value)} />
                </FormControl>

                <FormControl fullWidth className={classes.margin}>
                    <InputLabel>팩스</InputLabel>
                    <Input value={bcData.bcinformation.bcFax} onChange={(e) => setBcData.setbcinformation.setBcFax(e.target.value)} />
                </FormControl>

                <FormControl fullWidth className={classes.margin}>
                    <InputLabel>이메일</InputLabel>
                    <Input value={bcData.bcinformation.bcEmail} onChange={(e) => setBcData.setbcinformation.setBcEmail(e.target.value)} />
                </FormControl>

                <FormControl fullWidth className={classes.margin}>
                    <InputLabel>주소</InputLabel>
                    <Input value={bcData.bcinformation.bcAddr} onChange={(e) => setBcData.setbcinformation.setBcAddr(e.target.value)} />
                </FormControl>

                <FormControl fullWidth className={classes.margin}>
                    <InputLabel>영문 이름</InputLabel>
                    <Input value={bcData.bcinformation.bcEName} onChange={(e) => setBcData.setbcinformation.setBcEName(e.target.value)} />
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
                    <Input value={bcData.bcinformation.bcEAddr} onChange={(e) => setBcData.setbcinformation.setBcEAddr(e.target.value)} />
                </FormControl>
            </form>
        </>
    );
}
