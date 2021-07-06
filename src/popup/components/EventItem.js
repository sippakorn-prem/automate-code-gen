import React, { useEffect, useState } from 'react'
import { Prism } from 'react-syntax-highlighter'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton, Chip, Divider } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'
import { regexClickMenu } from '../../utils/eventActionTypeRegex.js'
import { hyphens2camel } from '../../utils/function.js'

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

  function getCode() {
    if (currentEvent === 'click') return codeClick()
    return ''
  }

  function codeClick() {
    return data.reduce((code, eventAction) => {
      return code + classifyCodeClick(eventAction) + '\n'
    }, '')
  }

  function classifyCodeClick(eventAction) {
    const type = eventAction?.action?.type
    if (type === 'menu') return generateCodeClickMenu(eventAction)
  }

  function generateCodeClickMenu({ hrd, dataQa, wrapper }) {
    let contentType = dataQa?.match(regexClickMenu) ? dataQa : wrapper.find(wr => wr.match(regexClickMenu))
    contentType = contentType?.split('menu-')?.[1] || ''
    contentType = hyphens2camel(contentType)
    return `$.suiteGotoMenu($store.menu.${hrd}.${contentType})`
  }

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
