/**
 * 共享工具函数
 */

/**
 * 生成组件 BEM 类名
 *
 * @example
 * bem('button', 'icon') // => 'ml-button__icon'
 * bem('button', 'icon', { active: true }) // => 'ml-button__icon ml-button__icon--active'
 */
export function bem(
  block: string,
  element?: string,
  modifiers?: Record<string, boolean | undefined>
): string {
  const prefix = 'ml';
  const base = element ? `${prefix}-${block}__${element}` : `${prefix}-${block}`;

  if (!modifiers) return base;

  const modifierClasses = Object.entries(modifiers)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => `${base}--${key}`);

  return [base, ...modifierClasses].join(' ');
}

/**
 * 验证值是否在允许列表中
 */
export function isValidValue<T>(value: T, allowed: readonly T[]): boolean {
  return allowed.includes(value);
}
