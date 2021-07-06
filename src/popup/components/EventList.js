import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import EventItem from './EventItem'

const useStyles = makeStyles(theme => ({
  root: {
    maxHeight: 400,
    overflow: 'auto',
  },
}))

function EventList(props) {
  const classes = useStyles()
  const { liveEvents = {}, currentEvent } = props

  return (
    <div className={classes.root}>
      <EventItem data={liveEvents[currentEvent]} {...{ liveEvents, currentEvent }} />
    </div>
  )
}

export default EventList
