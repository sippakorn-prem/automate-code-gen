import React, { useEffect, useState } from 'react'
import { Prism } from 'react-syntax-highlighter'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import regex from '../../utils/eventActionTypeRegex.js'
import { hyphens2camel, capitalize } from '../../utils/function.js'
import { generalBtn } from '../../utils/state.js'

import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
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
  const { list = [] } = props
  const [code, setCode] = useState('')

  function getCode() {
    return list.reduce((code, eventAction) => {
      let classifiedCode = getClassifiedCode(eventAction)
      if (classifiedCode) return code + classifiedCode + '\n'
      return code
    }, '')
  }

  function getClassifiedCode(eventAction) {
    const evnetType = eventAction?.action?.name
    if (evnetType === 'click') return classifyCodeClick(eventAction)
    // else if (evnetType === 'mouseover') return classifyCodeMouseover(eventAction)
  }

  function classifyCodeClick(eventAction) {
    const type = eventAction?.action?.type
    if (type === 'menu') return generateCodeClickMenu(eventAction)
    else if (type === 'tab-menu') return generateCodeClickTabMenu(eventAction)
    else if (type === 'breadcrumb') return generateCodeClickBreadcrumb(eventAction)
    else if (type === 'close') return generateCodeClickClose(eventAction)
    else if (type === 'card') return generateCodeClickCard(eventAction)
    else if (type === 'edit-row') return generateCodeClickEditRow(eventAction)
    else if (type === 'detail-row') return generateCodeClickDetailRow(eventAction)
    else if (generalBtn.includes(type)) return generateCodeClickGeneral(eventAction)
    else if (type === 'btn-group') return generateCodeClickBtnGroup(eventAction)
  }

  // function classifyCodeMouseover(eventAction) {
  //   const type = eventAction?.action?.type
  //   if (type === 'btn-group') return generateCodeHoverBtnGroup(eventAction)
  // }

  function generateCodeClickMenu(eventAction) {
    let contentType = getMatchDataQa({ ...eventAction, regexName: 'clickMenu' })
    contentType = contentType?.split('menu-')?.[1] || ''
    contentType = hyphens2camel(contentType)
    return `$.suiteGotoMenu($store.menu.${eventAction.hrd}.${contentType})`
  }
  function generateCodeClickTabMenu(eventAction) {
    let tabName = getMatchDataQa({ ...eventAction, regexName: 'clickTabMenu' })
    return `$.suiteClick({ name: '', type: 'tab', selector: '[data-qa="${tabName}"]' })`
  }
  function generateCodeClickBreadcrumb(eventAction) {
    let index = getMatchDataQa({ ...eventAction, regexName: 'clickBreadcrumb' })
    index = index?.split('breadcrumb-')?.[1] || ''
    return `$.suiteClick({ type: 'breadcrumb', index: ${index} })`
  }
  function generateCodeClickClose() {
    return `$.suiteClick({ name: '', type: 'close' })`
  }
  function generateCodeClickCard() {
    return `$.suiteClick({ name: '', type: 'card' })`
  }
  function generateCodeClickEditRow() {
    return `$.suiteClick({ name: '', type: 'edit-row' })`
  }
  function generateCodeClickDetailRow() {
    return `$.suiteClick({ name: '', type: 'detail-row' })`
  }
  function generateCodeClickGeneral(eventAction) {
    const type = capitalize(hyphens2camel(eventAction?.action?.type))
    let dataQa = getMatchDataQa({ ...eventAction, regexName: `click${type}` })
    if (dataQa) {
      const wrapper = eventAction?.wrapper?.length ? `, wrapper: '${eventAction?.wrapperSelector}'` : ''
      return `$.suiteClick({ type: '${eventAction?.action?.type}'${wrapper} })`
    }
  }
  function generateCodeClickBtnGroup(eventAction) {
    let dataQaBtn = getMatchDataQa({ ...eventAction, regexName: 'clickButton' })
    let dataQaHover = getMatchDataQa({ ...eventAction.hoverEvent, regexName: 'hoverBtnGroup' })
    if (dataQaBtn && dataQaHover) return `$.suiteClick({ name: '', selectorHover: '[data-qa="${dataQaHover}"]', selector: '[data-qa="${dataQaBtn}"]' })`
  }

  // function generateCodeHoverBtnGroup(eventAction) {
  //   let dataQa = getMatchDataQa({ ...eventAction, regexName: 'hoverBtnGroup' })
  //   if (dataQa) return `$.suiteClick({ name: '', selectorHover: '[data-qa="${dataQa}"]', selector: '' })`
  // }

  function getMatchDataQa({ dataQa, wrapper, regexName }) {
    return dataQa?.match(regex[regexName]) ? dataQa : wrapper.find(wr => wr.match(regex[regexName]))
  }

  useEffect(() => {
    setCode(getCode())
  }, [list])

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
