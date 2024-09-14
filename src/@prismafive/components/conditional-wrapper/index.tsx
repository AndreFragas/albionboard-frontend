import {PropsWithChildren} from 'react';

interface ConditionalWrapperProps {
  show: boolean;
}

export function ConditionalWrapper(props: PropsWithChildren<ConditionalWrapperProps>) {
  return <div>{props.show ? props.children : undefined}</div>;
}
