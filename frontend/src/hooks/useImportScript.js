import React, {useEffect, useState} from 'react';

const useImportScript = resourceUrl => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = resourceUrl;
    script.async = true;
    script.onload= function(){setLoaded(true)}
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, [resourceUrl]);

  return loaded
};
export default useImportScript;
