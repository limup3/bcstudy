import React, { useEffect } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import WorkIcon from "@material-ui/icons/Work";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ScatterPlotIcon from "@material-ui/icons/ScatterPlot";
import CloudIcon from "@material-ui/icons/Cloud";
import MenuIcon from "@material-ui/icons/Menu";
import "./Footer.css";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Header from "../header/Header";
import { MyBc } from "../../pages/mybc";
import { GroupBc } from "../../pages/groupbc";
import { Details } from "../../pages/details";
import { useHistory, useLocation } from "react-router-dom";

//페이지 하단구성 (내명함첩 그룹명함첩 커뮤니티 커리어 더보기)
//Tab을 사용하여 페이지별로 구분하는것이 아니라 tabpanel로 구별
//Tab 별로 인덱스 사용하여 구분

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-prevent-tabpanel-${index}`}
            aria-labelledby={`scrollable-prevent-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-prevent-tab-${index}`,
        "aria-controls": `scrollable-prevent-tabpanel-${index}`,
    };
}

const handleLater = (e) => {
    e.preventDefault();
    alert("추후 예정");
};

export default function Footer() {
    const [value, setValue] = React.useState(0);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if (location.state !== undefined) {
            // location.state.FooterValue === value;
            setValue(location.state.FooterValue);
        } else if (location.state === undefined) {
            setValue(0);
        }
    }, [location.state]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //Footer 포지션관리 (새로고침이나 뒤로가기 눌렀을때 해당위치로 올수있게)
    const handleMyBc = () => {
        history.push({
            pathname: "/MyBc",
            state: { FooterValue: 0 },
        });
    };
    const handleGroupBc = () => {
        history.push({
            pathname: "/MyBc",
            state: { FooterValue: 1 },
        });
    };
    const handleDetail = () => {
        history.push({
            pathname: "/MyBc",
            state: { FooterValue: 4 },
        });
    };

    return (
        <>
            <AppBar>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" indicatorColor="secondary" className="Footer">
                    <Tab icon={<WorkIcon />} label="내명함" {...a11yProps(0)} onClick={handleMyBc} />
                    <Tab icon={<SupervisorAccountIcon />} label="그룹명함" {...a11yProps(1)} onClick={handleGroupBc} />
                    <Tab icon={<ScatterPlotIcon />} label="커뮤니티" {...a11yProps(2)} onClick={handleLater} />
                    <Tab icon={<CloudIcon />} label="커리어" {...a11yProps(3)} onClick={handleLater} />
                    <Tab icon={<MenuIcon />} label="더보기" {...a11yProps(4)} onClick={handleDetail} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Header />
                <MyBc />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <GroupBc />
            </TabPanel>
            <TabPanel value={value} index={2}>
                추후 예정
            </TabPanel>
            <TabPanel value={value} index={3}>
                추후 예정
            </TabPanel>
            <TabPanel value={value} index={4}>
                <Details />
            </TabPanel>
        </>
    );
}
