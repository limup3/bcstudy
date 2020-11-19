import React from "react";
import { Switch, Route } from "react-router-dom";
import { Footer, Header } from "./components";
import NotFound from "./helpers/NotFound";
import { ChangePw, Login, SignUp, UserDelete } from "./pages/account";
import { BcImport, CardBookAdd, GroupAdd, GroupAddNext, GroupBcRename, GroupDetail, GroupRename } from "./pages/groupbc";
import { BcDetailEdit, BcDetail, BcEdit, BcTyping, BcEntering, EFDetail, Test, EnteringEdit } from "./pages/mybc";
import { Notice, NoticeDetail } from "./pages/notice";

//페이지 관리, App에서 page호출

const Page = () => (
    <Switch>
        <Route path="/" exact>
            <Login />
        </Route>

        <Route path="/SignUp">
            <SignUp />
        </Route>

        <Route path="/UserDelete">
            <UserDelete />
        </Route>

        <Route path="/ChangePw">
            <ChangePw />
        </Route>

        <Route path="/MyBc">
            <Footer />
        </Route>

        <Route path="/BcEdit">
            <Header />
            <BcEdit />
        </Route>

        <Route path="/BcDetail/:id" render={(props) => <BcDetail {...props} />}></Route>

        <Route path="/BcDetailEdit">
            <BcDetailEdit />
        </Route>

        <Route path="/BcTyping">
            <BcTyping />
        </Route>

        <Route path="/BcEntering">
            <BcEntering />
        </Route>

        <Route path="/EnteringEdit/:id" render={(props) => <EnteringEdit {...props} />}></Route>

        <Route path="/EFDetail/:id" render={(props) => <EFDetail {...props} />}></Route>

        <Route path="/BcImport">
            <BcImport />
        </Route>

        <Route path="/GroupAdd">
            <GroupAdd />
        </Route>

        <Route path="/GroupAddNext">
            <GroupAddNext />
        </Route>

        <Route path="/CardBookAdd/:id/:user_id" render={(props) => <CardBookAdd {...props} />}></Route>

        <Route path="/BcDetail/:id" render={(props) => <BcDetail {...props} />}></Route>

        <Route path="/GroupDetail/:id" render={(props) => <GroupDetail {...props} />}></Route>

        <Route path="/GroupRename/:name/:id/:user_id" render={(props) => <GroupRename {...props} />}></Route>

        <Route path="/GroupBcRename/:id/:user_id" render={(props) => <GroupBcRename {...props} />}></Route>

        <Route path="/Notice">
            <Notice />
        </Route>

        <Route path="/NoticeDetail/:id" render={(props) => <NoticeDetail {...props} />}></Route>

        <Route path="/Test">
            <Test />
        </Route>

        <Route component={NotFound} />
    </Switch>
);

export default Page;
