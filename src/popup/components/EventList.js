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
  const { liveEvents = [] } = props

  return (
    <div className={classes.root}>
      <EventItem list={liveEvents} />
    </div>
  )
}

export default EventList
