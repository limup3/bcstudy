import React, { useEffect } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Entering from "./Entering";
import EnteringFail from "./EnteringFail";
import { useHistory, useLocation } from "react-router-dom";

// 입력중인 명함

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
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginLeft: "20px",
        width: "90%",
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function BcEntering() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        //로그인 하지 않은 유저는 로그인 페이지로 리다이렉션
        if (localStorage.getItem("userKey") === null && sessionStorage.getItem("userKey") === null) {
            alert("로그인이 필요합니다.");
            history.push("/");
        }
        if (location.state !== undefined) {
            setValue(location.state.EnteringValue);
        } else if (location.state === undefined) {
            setValue(0);
        }
    }, [history, location.state]);

    const handleBack = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/MyBc",
            state: { FooterValue: 0 },
        });
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Paper elevation={0}>
                        <ArrowBackIosIcon style={{ marginLeft: "10px", float: "left", fontSize: 35 }} onClick={handleBack} />
                        <h1 style={{ margin: "1rem", marginLeft: "50px" }}>입력중인 명함</h1>
                    </Paper>
                </Grid>
                <br />
                <br />
                <br />
                <br />
                <br />
            </Grid>

            <div className={classes.root}>
                <AppBar position="static" color="default" elevation={0}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                        style={{ backgroundColor: "white" }}
                    >
                        <Tab label="입력중" {...a11yProps(0)} />
                        <Tab label="입력불가" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <Entering />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <EnteringFail />
                </TabPanel>
            </div>
        </>
    );
}
