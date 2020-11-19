import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Page from './Page';
import { BcProvider } from './helpers/context/BcContext'
import axios from 'axios';

//Django CSRF 세션 인증 , https://jangsus1.tistory.com/2 참고
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';


//BCProvider = context Api 사용 

const App = () => (
    <BrowserRouter>
      <BcProvider>
      <Page />
      </BcProvider>
    </BrowserRouter>
);

export default App;