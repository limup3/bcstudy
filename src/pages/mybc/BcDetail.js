import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MessageIcon from "@material-ui/icons/Message";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PhoneIcon from "@material-ui/icons/Phone";
import { Map } from "../../components";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useBc, useSetBc } from "../../helpers/context/BcContext";
import Button from "@material-ui/core/Button";
import CreateIcon from "@material-ui/icons/Create";
import axios from "axios";

//명함 상세 페이지 , match를 통한 사용자 확인

export default function BcDetail({ match }) {
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
        //iso 8601 형태 현재 서울 날짜
        var timezoneOffset = new Date().getTimezoneOffset() * 60000;
        var timezoneDate = new Date(Date.now() - timezoneOffset);

        axios
            .get(`/api/businesscard/${match.params.id}`, headers)
            .then((response) => {
                setBcItem(response.data);
                if (response.data.ocr_id !== null) {
                    axios
                        .get(
                            //이미지 가져오기
                            `/api/businesscardocr/${response.data.ocr_id}`,
                            headers
                        )
                        .then((ocrResponse) => {
                            setOcrImage(ocrResponse.data.image);
                        })
                        .catch((error) => {
                            throw error;
                        });
                }

                axios
                    .put(
                        //최근 조회 업데이트
                        `/api/businesscard/${match.params.id}/`,
                        {
                            user_id: response.data.user_id,
                            my_bc: response.data.my_bc,
                            inquiry_date: timezoneDate.toISOString(),
                        },
                        headers
                    )
                    .then((response) => {})
                    .catch((error) => {
                        throw error;
                    });
            })
            .catch((error) => {
                throw error;
            });
    }, [history, match.params.id]);

    const bcData = useBc();
    const setBcData = useSetBc();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [ocrImage, setOcrImage] = useState("");
    const [bcItem, setBcItem] = useState({
        id: 0,
        name: "",
        company_name: "",
        position: "",
        department: "",
        direct: "",
        phone: "",
        mobile: "",
        fax: "",
        email: "",
        address: "",
        eng_name: "",
        eng_company_name: "",
        eng_position: "",
        eng_deptment: "",
        eng_address: "",
        my_bc: false,
        inquiry_date: null,
        create_date: "",
        update_date: "",
        user_id: 0,
        book_id: null,
        ocr_id: null,
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // const handlePhone = () => {
    //     setAnchorEl(null);
    //     window.location.href = `tel:${bcItem.phone}`;
    // };

    const handleDelete = () => {
        setAnchorEl(null);
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
            .delete(`/api/businesscard/${bcItem.id}/`, headers)
            .then((response) => {
                history.push("/Mybc");
            })
            .catch((error) => {
                alert("실패");
                console.log(error.response);
                throw error;
            });
    };

    const handleDetailEdit = (e) => {
        e.preventDefault();
        setBcData.setbcinformation.setBcName(bcItem.name);
        setBcData.setbcinformation.setBcPosition(bcItem.position);
        setBcData.setbcinformation.setBcDepartment(bcItem.department);
        setBcData.setbcinformation.setBcCompany(bcItem.company_name);
        setBcData.setbcinformation.setBcMobile(bcItem.mobile);
        setBcData.setbcinformation.setBcPhone(bcItem.phone);
        setBcData.setbcinformation.setBcDirect(bcItem.direct);
        setBcData.setbcinformation.setBcFax(bcItem.fax);
        setBcData.setbcinformation.setBcEmail(bcItem.email);
        setBcData.setbcinformation.setBcAddr(bcItem.address);
        setBcData.setbcinformation.setBcEName(bcItem.eng_name);
        setBcData.setbcinformation.setBcECompany(bcItem.eng_company_name);
        setBcData.setbcinformation.setBcEPosition(bcItem.eng_position);
        setBcData.setbcinformation.setBcEDepartment(bcItem.eng_deptment);
        setBcData.setbcinformation.setBcEAddr(bcItem.eng_address);
        history.push({
            pathname: "/BcDetailEdit",
            state: {
                id: bcItem.id,
                name: bcItem.name,
                company_name: bcItem.company_name,
                position: bcItem.position,
                department: bcItem.department,
                direct: bcItem.direct,
                phone: bcItem.phone,
                mobile: bcItem.mobile,
                fax: bcItem.fax,
                email: bcItem.email,
                address: bcItem.address,
                eng_name: bcItem.eng_name,
                eng_company_name: bcItem.eng_company_name,
                eng_position: bcItem.eng_position,
                eng_deptment: bcItem.eng_deptment,
                eng_address: bcItem.eng_address,
                my_bc: bcItem.my_bc,
                inquiry_date: bcItem.inquiry_date,
                create_date: bcItem.create_date,
                update_date: bcItem.update_date,
                user_id: bcItem.user_id,
                book_id: bcItem.book_id,
                ocr_id: bcItem.ocr_id,
            },
        });
    };
    return (
        <>
            <Grid container>
                <Grid item xs={8}>
                    <Paper elevation={0}>
                        <ArrowBackIosIcon
                            style={{ marginLeft: "10px", marginBottom: "10px", float: "left", fontSize: 25 }}
                            onClick={bcData.handleBack}
                        />
                        <h2 style={{ margin: "1rem", marginLeft: "50px" }}>명함 상세</h2>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <MoreVertIcon style={{ margin: "1rem", marginRight: "auto", float: "right", fontSize: 25 }} onClick={handleClick} />
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        //상단 메뉴바
                    >
                        {/* <MenuItem onClick={handlePhone}>휴대폰 연락처에 저장</MenuItem> */}
                        <MenuItem onClick={handleDelete} style={{ color: "red" }}>
                            명함 삭제
                        </MenuItem>
                    </Menu>

                    <Button
                        startIcon={<CreateIcon />}
                        size="small"
                        style={{ float: "right", marginTop: "15px", left: "10px", color: "gray" }}
                        onClick={handleDetailEdit}
                    >
                        편집
                    </Button>
                </Grid>
                {ocrImage !== "" && ocrImage !== null && (
                    <img
                        style={{ marginLeft: "auto", marginRight: "auto", width: "350px", height: "200px" }}
                        src={ocrImage}
                        alt={"명함사진"}
                    />
                )}

                <Grid container>
                    <Grid item xs={9} style={{ padding: "0.3rem", lineHeight: "0.5rem" }}>
                        <h2 style={{ fontSize: 20 }}>{bcItem.name}</h2>
                        <p style={{ fontSize: 13 }}>{bcItem.position}</p>
                        <p style={{ fontSize: 13 }}>{bcItem.company_name}</p>
                    </Grid>
                    <Grid item xs={3}>
                        {/* <AccountCircleIcon color="disabled" style={{ fontSize: 50, float:'right', marginTop: '15px', padding:'0.5rem' }}/> */}
                    </Grid>
                </Grid>
            </Grid>
            <hr />
            <Grid container>
                <Grid item xs={9} style={{ padding: "0.3rem" }}>
                    <Paper elevation={0}>
                        <h2 style={{ fontSize: 18 }}>연락처</h2>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        startIcon={<CreateIcon />}
                        size="small"
                        style={{ float: "right", marginTop: "15px", color: "gray" }}
                        onClick={handleDetailEdit}
                    >
                        편집
                    </Button>
                </Grid>

                <Grid item xs={6} style={{ padding: "0.3rem", lineHeight: "0.5rem" }}>
                    <p style={{ fontSize: 13, color: "gray" }}>휴대폰</p>
                    <p style={{ fontSize: 13, lineHeight: "1rem" }}>{bcItem.mobile}</p>
                </Grid>
                <Grid item xs={6}>
                    <a href={"tel:" + bcItem.mobile}>
                        <PhoneIcon style={{ float: "right", marginTop: "15px", padding: "0.5rem", color: "black" }} />
                    </a>
                    <a href={"sms:" + bcItem.mobile}>
                        <MessageIcon style={{ float: "right", marginTop: "15px", padding: "0.5rem", color: "black" }} />
                    </a>
                </Grid>
                <Grid item xs={6} style={{ padding: "0.3rem", lineHeight: "0.5rem" }}>
                    <p style={{ fontSize: 13, color: "gray" }}>이메일</p>
                    <p style={{ fontSize: 13, lineHeight: "1rem" }}>{bcItem.email}</p>
                </Grid>
                <Grid item xs={6}>
                    <a href={"mailto:" + bcItem.email}>
                        <MailOutlineIcon style={{ float: "right", marginTop: "15px", padding: "0.5rem", color: "black" }} />
                    </a>
                </Grid>

                <Grid item xs={6} style={{ padding: "0.3rem", lineHeight: "0.5rem" }}>
                    <p style={{ fontSize: 13, color: "gray" }}>유선전화</p>
                    <p style={{ fontSize: 13, lineHeight: "1rem" }}>{bcItem.phone}</p>
                </Grid>
                <Grid item xs={6}>
                    <a href={"tel:" + bcItem.phone}>
                        <PhoneIcon style={{ float: "right", marginTop: "15px", padding: "0.5rem", color: "black" }} />
                    </a>
                </Grid>

                {bcItem.fax !== "" && (
                    <>
                        <Grid item xs={12} style={{ padding: "0.3rem", lineHeight: "0.5rem" }}>
                            <p style={{ fontSize: 13, color: "gray" }}>팩스</p>
                            <p style={{ fontSize: 13, lineHeight: "1rem" }}>{bcItem.fax}</p>
                        </Grid>
                    </>
                )}

                {bcItem.address !== "" && (
                    <>
                        <Grid item xs={12} style={{ padding: "0.3rem", lineHeight: "0.5rem" }}>
                            <p style={{ fontSize: 13, color: "gray" }}>주소</p>
                            <p style={{ fontSize: 13, lineHeight: "1rem" }}>{bcItem.address}</p>
                        </Grid>
                        <Map bcAddr={bcItem.address} />
                    </>
                )}
            </Grid>
        </>
    );
}
