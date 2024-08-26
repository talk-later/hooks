import useLatest from '../useLatest';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import getDocumentOrShadow from '../utils/getDocumentOrShadow';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type DocumentEventKey = keyof DocumentEventMap;

// 在点击目标元素之外的任何地方时触发特定的回调函数
export default function useClickAway<T extends Event = Event>(
  // 触发的回调函数
  onClickAway: (event: T) => void,
  // 目标元素
  target: BasicTarget | BasicTarget[],
  // 监听的事件
  eventName: DocumentEventKey | DocumentEventKey[] = 'click',
) {
  // 使用useLatest钩子保持onClickAway函数的最新引用，避免闭包
  const onClickAwayRef = useLatest(onClickAway);

  // 使用一个带有目标元素支持的自定义useEffect钩子
  useEffectWithTarget(
    () => {
      const handler = (event: any) => {
        // 如果点击事件发生在目标元素之内，则不执行回调
        const targets = Array.isArray(target) ? target : [target];
        if (
          targets.some((item) => {
            const targetElement = getTargetElement(item);
            return !targetElement || targetElement.contains(event.target);
          })
        ) {
          return;
        }
        onClickAwayRef.current(event);
      };

      const documentOrShadow = getDocumentOrShadow(target);

      const eventNames = Array.isArray(eventName) ? eventName : [eventName];

      eventNames.forEach((event) => documentOrShadow.addEventListener(event, handler));

      return () => {
        eventNames.forEach((event) => documentOrShadow.removeEventListener(event, handler));
      };
    },
    Array.isArray(eventName) ? eventName : [eventName],
    // 指定目标元素，当目标元素变化时，将卸载旧的事件监听器并安装新的
    target,
  );
}
