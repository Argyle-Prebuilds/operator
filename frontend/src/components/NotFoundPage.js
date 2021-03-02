import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";


const NotFoundPage = () => {
  const history = useHistory();
  useEffect(() => {
    history.push('/');
  }, [])

  return <>
  </>;
}

export default NotFoundPage;
