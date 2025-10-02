import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/TaskAnimations.css';

// 任务添加动画包装器
export const TaskAddAnimation = ({ children, in: inProp }) => (
  <CSSTransition
    in={inProp}
    timeout={300}
    classNames="task-add"
    unmountOnExit
  >
    {children}
  </CSSTransition>
);

// 任务完成动画包装器
export const TaskCompleteAnimation = ({ children, completed }) => (
  <CSSTransition
    in={completed}
    timeout={300}
    classNames="task-complete"
  >
    {children}
  </CSSTransition>
);

// 任务删除动画包装器
export const TaskDeleteAnimation = ({ children, in: inProp }) => (
  <CSSTransition
    in={inProp}
    timeout={300}
    classNames="task-delete"
    unmountOnExit
  >
    {children}
  </CSSTransition>
);

// 列表动画组
export const AnimatedList = ({ children }) => (
  <TransitionGroup>
    {children}
  </TransitionGroup>
);

// 动画列表项
export const AnimatedListItem = ({ children, in: inProp, ...props }) => (
  <CSSTransition
    {...props}
    in={inProp}
    timeout={300}
    classNames="list-item"
  >
    {children}
  </CSSTransition>
);

export default {
  TaskAddAnimation,
  TaskCompleteAnimation,
  TaskDeleteAnimation,
  AnimatedList,
  AnimatedListItem
};