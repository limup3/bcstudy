import React from "react";
import {Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import {useBc} from '../../helpers/context/BcContext'

//명함 목록들 , 조각으로 분리

const useStyles = makeStyles((theme) => ({

    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.secondary,
    },

  }));

  export default function BcList(props) {

    const classes = useStyles();

    const bcData = useBc()

    return (
      <>
      

        {!props.edit &&
        <CardContent>
        <p style={{color:'#969595'}}>{bcData.bcinformation.bcCreateDate}</p>
         <Link to={`/BcDetail/${props.bcName}/${props.bcPosition}/${props.bcCompany}`} style={{textDecoration:"none"}}>

          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={6}>
                <h2>{props.bcName}</h2>
                <p>{props.bcPosition}</p>
                <p>{props.bcCompany}</p>
              </Grid>
              <Grid item xs={6}>
              <RecentActorsIcon color="disabled" style={{ fontSize: 130 }}/>
              </Grid>
            </Grid>
          </Paper>
         </Link>
         
         </CardContent>
        }

        {props.edit && //편집모드일때 명함 상세화면으로 넘어가지않게 조건부 렌더링
        <CardContent>
        <p style={{color:'#969595'}}>{bcData.bcinformation.bcCreateDate}</p>
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={6}>
              <h2>{props.bcName}</h2>
              <p>{props.bcPosition}</p>
              <p>{props.bcCompany}</p>
            </Grid>
            <Grid item xs={6}>
            <RecentActorsIcon color="disabled" style={{ fontSize: 130 }}/>
            </Grid>
          </Grid>
        </Paper>
        </CardContent>
        }
      </>
      
    );
  }