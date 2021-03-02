import React, { useEffect, useState } from 'react'
import { Prism } from 'react-syntax-highlighter';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Chip, Divider } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  topControl: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  prismCode: {
    position: 'relative'
  },
  btnCopy: {
    
  }
}))

function EventItem (props){
  const classes = useStyles()
  const { data } = props
  const [code, setCode] = useState('')

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  function getCode (){
    if(data.action === 'click') return codeClick()
    return ''
  }

  function codeClick (){
    console.log({ codeClick: data })
    const { selector, dataQa, wrapper, wrapperSelector } = data
    const target = dataQa || wrapper[0] ? `[data-qa="${dataQa || wrapper[0]}"]` : selector
    return `$.suiteClick({ name: 'ACTION_NAME', btn: '${target}', visible: '${wrapperSelector}' })`
  }

  useEffect(()=>{
    console.log(data)
    setCode(getCode())
  }, [])

  return (
    <>
      <div className={classes.root}>
        <div className={classes.topControl}>
          <Chip
            label={data.action.capitalize()}
            color="primary"
            variant="outlined"
          />
          {code &&
            <CopyToClipboard className={classes.btnCopy} text={getCode()}>
              <IconButton size="small"><FileCopy fontSize="small"/></IconButton>
            </CopyToClipboard>
          }
        </div>
        {code &&
          <div className={classes.prismCode}>
            <Prism language="javascript">{code}</Prism>
          </div>
        }
        <Divider className={classes.divider}/>
      </div>
    </>
  )
}

export default EventItem