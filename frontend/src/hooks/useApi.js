import { useState, useCallback } from 'react';

/**
 * useApi — generic hook for wrapping any API call with loading/error/data state.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(getAllBlogs);
 *   useEffect(() => { execute(); }, []);
 */
export const useApi = (apiFn) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.userMessage || 'Something went wrong. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
};
