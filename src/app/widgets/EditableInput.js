import React, { useState, useEffect } from "react";
import EditIcon from '@material-ui/icons/Edit';

const Editable = ({
  text,
  type,
  placeholder,
  children,
  childRef,
  ...props
}) => {
  const [isEditing, setEditing] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus();
    }
  }, [isEditing, childRef]);

  const handleKeyDown = (event, type) => {
    const { key } = event;
    const keys = ["Escape", "Tab"];
    const enterKey = "Enter";
    const allKeys = [...keys, enterKey];
    if (
      (type === "textarea" && keys.indexOf(key) > -1) ||
      (type !== "textarea" && allKeys.indexOf(key) > -1)
    ) {
      setEditing(false);
    }
  };

  return (
    <section {...props}>
      {isEditing ? (
        <div
          onBlur={() => setEditing(false)}
          onKeyDown={e => handleKeyDown(e, type)}
        >
          {children}
        </div>
      ) : (
        <div
          style={{ color: text ? 'black' : 'grey'}}
          onClick={() => setEditing(true)}
          onMouseEnter={() => setShowIcon(true)}
          onMouseLeave={() => setShowIcon(false)}
        >
          {text || placeholder || "Editable content"}
          { showIcon && <EditIcon />}
        </div>
      )}
    </section>
  );
};

export default Editable;