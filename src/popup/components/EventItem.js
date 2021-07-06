import React, { useEffect, useState } from 'react'
import { Prism } from 'react-syntax-highlighter'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton, Chip, Divider } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  topControl: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  prismCode: {
    position: 'relative',
  },
}))

function EventItem(props) {
  const classes = useStyles()
  const { data = [], liveEvents, currentEvent } = props
  const [code, setCode] = useState('')

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }

  function getCode() {
    if (currentEvent === 'click') return codeClick()
    return ''
  }

  function codeClick() {
    return data.reduce((code, event) => {
      const { selector, dataQa, wrapper, wrapperSelector } = event
      const target = dataQa || wrapper[0] ? `[data-qa="${dataQa || wrapper[0]}"]` : selector
      return code + `$.suiteClick({ name: 'ACTION_NAME', btn: '${target}', visible: '${wrapperSelector}' })\n`
    }, '')
  }

  function classifyCodeClick() {}

  useEffect(() => {
    setCode(getCode())
  }, [liveEvents, currentEvent])

  return (
    <>
      {code && (
        <div className={classes.root}>
          <div className={classes.topControl}>
            {
              <CopyToClipboard className={classes.btnCopy} text={getCode()}>
                <IconButton size='small'>
                  <FileCopy fontSize='small' />
                </IconButton>
              </CopyToClipboard>
            }
          </div>
          {
            <div className={classes.prismCode}>
              <Prism language='javascript'>{code}</Prism>
            </div>
          }
        </div>
      )}
    </>
  )
}

export default EventItem
