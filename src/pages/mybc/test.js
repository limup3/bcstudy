import React from "react";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {useBc} from '../../helpers/context/BcContext'

//테스트파일 , 코드 저장용도

  export default function test2() {

    const bcData = useBc()

    return (
      <>
    <Grid container>
    <Grid item xs={12}>
    <Paper elevation={0}>
    <ArrowBackIosIcon style={{marginLeft:'10px',float:'left', fontSize: 35}} onClick={bcData.handleBack}/>
    <h1 style={{margin:'1rem', marginLeft:'50px'}}>입력중인 명함</h1>
    </Paper>
    </Grid>
    </Grid>
      </>
      
    );
  }