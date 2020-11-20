import React, { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import "./Footer.css";
import AppBar from "@material-ui/core/AppBar";
// import clsx from "clsx";
// import { makeStyles } from "@material-ui/core/styles";
// import Drawer from '@material-ui/core/Drawer';
// import Button from '@material-ui/core/Button';
// import List from "@material-ui/core/List";
// import Divider from "@material-ui/core/Divider";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemText from "@material-ui/core/ListItemText";
import axios from "axios";
import { useHistory } from "react-router-dom";

// 내 명함첩에서 편집버튼 클릭시 나오는 하단 바 , Drawer 사용

// const useStyles = makeStyles({
//     list: {
//         width: 250,
//     },
//     fullList: {
//         width: "auto",
//     },
// });

export default function EditFooter(props) {
    const history = useHistory();
    const [email, setEmail] = useState([]);
    const handleDelete = () => {
        props.checked.forEach(function (data, idx) {
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
                .delete(`https://bcbackend.azurewebsites.net/api/businesscard/${data.id}/`, headers)
                .then((response) => {
                    history.push({
                        pathname: "/MyBc",
                        state: { FooterValue: 0 },
                    });
                })
                .catch((error) => {
                    alert("실패");
                    console.log(error.response);
                    throw error;
                });
        });
    };

    const handleEmail = () => {
        //이메일 발송 , forEach를 통해 이메일에 값을 넣어서 체크박스에 선택된 항목 보내기
        // if (emailVal.match(regExp) != null) {
        var regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        props.checked.forEach(function (data, idx) {
            if (data.email.match(regExp) != null) {
                setEmail(email.push(data.email));
            }
        });
        window.location.href = `mailto:${email}`;
        window.location.reload();
    };

    // const classes = useStyles();
    // const [state, setState] = React.useState({
    //     더보기: false,
    // });

    // const toggleDrawer = (anchor, open) => (event) => {
    //     if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
    //         return;
    //     }

    //     setState({ ...state, [anchor]: open });
    // };

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // const list = (anchor) => (
    //     <div
    //         className={clsx(classes.list, {
    //             [classes.fullList]: anchor === "top",
    //         })}
    //         role="presentation"
    //         onClick={toggleDrawer(anchor, false)}
    //         onKeyDown={toggleDrawer(anchor, false)}
    //     >
    //         <List>
    //             <ListItem>
    //                 <ListItemText primary={"팀 명함첩으로 복제"} />
    //             </ListItem>
    //             <ListItem>
    //                 <ListItemText primary={"파일로 내보내기"} />
    //             </ListItem>
    //             <ListItem>
    //                 <ListItemText primary={"명함 삭제"} onClick={handleDelete} />
    //             </ListItem>
    //         </List>
    //         <Divider />
    //     </div>
    // );

    return (
        <>
            <AppBar>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" className="Footer" indicatorColor="primary">
                    {/* <Tab  label="명함첩 이동" /> */}
                    <Tab label="이메일전송" onClick={handleEmail} />
                    <Tab label="삭제" onClick={handleDelete} />
                    {/* <div>
      {['더보기'].map((anchor) => (
        <React.Fragment key={anchor} >
          <Button onClick={toggleDrawer(anchor, true)} style={{color:'#cacaca', margin:'0.4rem' }}>{anchor}</Button>
          <Drawer anchor="bottom" open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div> */}
                </Tabs>
            </AppBar>

            {/* </Paper> */}
        </>
    );
}
