import { useCallback, useState } from 'react';

// 重新设置状态触发重新渲染
const useUpdate = () => {
  const [, setState] = useState({});

  return useCallback(() => setState({}), []);
};

export default useUpdate;
