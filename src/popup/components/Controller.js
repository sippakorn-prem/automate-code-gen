import React from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, Typography } from '@material-ui/core'
import { grey, red } from '@material-ui/core/colors'
import { FiberManualRecord, Stop } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  root: {},
  recordControl: {
    display: 'flex',
    justifyContent: 'space-between',
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

function Controller(props) {
  const classes = useStyles()
  const { isRecording, liveEvents = {}, toggleRecord, toggleReset, routeLocation } = props

  return (
    <Box className={classes.root} boxShadow={3}>
      <div className='p-12'>
        <Typography>Automate Code Gen</Typography>
        <Typography variant='caption' display='block' gutterBottom>
          {routeLocation?.href || ''}
        </Typography>
      </div>
      <div className={classes.recordControl}>
        <Button
          className={classNames(classes.btn, isRecording ? classes.btnRecording : classes.btnRecord)}
          startIcon={isRecording ? <Stop /> : <FiberManualRecord />}
          variant={isRecording ? 'contained' : 'text'}
          onClick={toggleRecord}
        >
          {isRecording ? 'Stop' : 'Record'}
        </Button>
        {Boolean(Object.keys(liveEvents).length) && (
          <Button className={classes.btn} color='primary' onClick={toggleReset}>
            Reset
          </Button>
        )}
      </div>
    </Box>
  )
}

export default Controller
