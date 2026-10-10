import type { ChatLineBreakBehavior, ChatSendBehavior } from '../../types/settings'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

export type ComposerEnterAction = 'submit' | 'newline' | 'none'

export function shouldSubmitOnEnter(
  event: Pick<KeyboardEvent | ReactKeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'>,
  behavior: ChatSendBehavior,
): boolean {
  if (event.key !== 'Enter' || event.shiftKey) return false
  if (behavior === 'modifierEnter') return event.ctrlKey || event.metaKey
  return !event.ctrlKey && !event.metaKey && !event.altKey
}

function matchesLineBreakCombo(
  event: Pick<KeyboardEvent | ReactKeyboardEvent, 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'>,
  behavior: ChatLineBreakBehavior,
): boolean {
  switch (behavior) {
    case 'ctrlEnter': return event.ctrlKey || event.metaKey
    case 'altEnter': return event.altKey
    case 'shiftEnter': return event.shiftKey
    case 'enter': return !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey
  }
}

/**
 * 把一次 Enter 按键解析成 composer 的动作：发送、换行或忽略。
 * 发送优先；未配置的 Enter 组合不再隐式换行，换行键由设置决定。
 */
export function resolveComposerEnterAction(
  event: Pick<KeyboardEvent | ReactKeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'>,
  send: ChatSendBehavior,
  lineBreak: ChatLineBreakBehavior,
): ComposerEnterAction {
  if (event.key !== 'Enter') return 'none'
  if (shouldSubmitOnEnter(event, send)) return 'submit'
  if (matchesLineBreakCombo(event, lineBreak)) return 'newline'
  return 'none'
}
