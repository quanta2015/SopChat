import { useState, useEffect } from 'react';

/**
 * @param service
 * @param initParams
 *
 */
const useRequest = service => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(service, 'service');
  useEffect(() => {
    setLoading(true);
    service()
      .then(result => {
        // console.log(result, 'sss');
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return {
    data,
    loading,
  };
};

export default useRequest;
