import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, InputLabel, Select } from '@material-ui/core'
import { capitalize } from '../../utils/function.js'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

function EventList(props) {
  const classes = useStyles()
  const { liveEvents, currentEvent, onChangeEvent } = props

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor='age-native-simple'>Event</InputLabel>
        <Select native value={currentEvent} onChange={onChangeEvent}>
          {Object.keys(liveEvents).map(d => (
            <option key={d} value={d}>
              {capitalize(d)}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default EventList
