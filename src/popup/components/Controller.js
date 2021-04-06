import React from 'react'
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import { FiberManualRecord, Stop } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  btn: {
    margin: theme.spacing(2),
  },
  btnRecord: {
    color: red[500],
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  btnRecording: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
}))

function Controller (props){
  const classes = useStyles()
  const { isRecording, liveEvents = {}, toggleRecord, toggleReset } = props

  return (
    <Box className={classes.root} boxShadow={3}>
      <Button
        className={classNames(classes.btn, isRecording ? classes.btnRecording : classes.btnRecord)}
        startIcon={isRecording ? <Stop/>: <FiberManualRecord/>}
        variant={isRecording ? 'contained' : 'text'}
        onClick={toggleRecord}>
        {isRecording ? 'Stop' : 'Record'}
      </Button>
      {Boolean(Object.keys(liveEvents).length) &&
        <Button className={classes.btn} color="primary" onClick={toggleReset}>Reset</Button>
      }
    </Box>
  )
}

export default Controller