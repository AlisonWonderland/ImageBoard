import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const Context = createContext({});

export const Provider = props => {
    // Initial values are obtained from the props
    const {
        parentThread,
        parent : initialParent,
        parentType: initialParentType,
        children
    } = props
  
    // // Use State to keep the values
    const [parent, setParent] = useState(initialParent);
    const [parentType, setParentType] = useState(initialParentType);
    const [ replyText, setReplyText ] = useState('')
    const [ showForm, setShowForm ] = useState(false)
    const [ isReply, setIsReply ] = useState(true)

    const handleFormOpen = (parentNum, parentType, isReply) => {
        setIsReply(isReply)
        setParentType(parentType)
        setParent(parentNum)
        
        if(replyText === '' && isReply)
            setReplyText(`>>${parentNum}\n`)

        setShowForm(true)
    }

    // Make the context object:
    const formContext = {
        parentThread,
        parent,
        parentType,
        isReply,
        showForm,
        setShowForm,
        replyText,
        setReplyText,
        handleFormOpen
    };
  
    // pass the value in provider and return
    return <Context.Provider value={formContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

Provider.propTypes = {
  parent: PropTypes.number,
  parentType: PropTypes.string,
  isReply: PropTypes.bool,
  showForm: PropTypes.bool
};

Provider.defaultProps = {
    parent: 0,
    parentType: '',
    isReply: false,
    showForm: false
  };