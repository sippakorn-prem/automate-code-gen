import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import EventItem from './EventItem';

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 400,
    overflow: 'auto',
  },
  item: {
    
  }
}))

function EventList (props){
  const classes = useStyles()
  const { liveEvents = [] } = props

  return (
    <div className={classes.root}>
      {liveEvents.map((item, i) => <EventItem key={i} data={item}/>)}
    </div>
  )
}

export default EventList