import './styles/button.css';
import './styles/input.css';
import './styles/select.css';
import './styles/dialog.css';

/**
 * VCL Vue 组件库
 *
 * 使用方式：
 *   import { Button, Input, Select, Dialog } from '@my-lib/components';
 *   import '@my-lib/components/style.css';
 */

export { Button } from './button';
export type { ButtonType, ButtonSize } from './button';

export { Input } from './input';
export type { InputSize, InputType } from './input';

export { Select } from './select';
export type { SelectSize, SelectValue, SelectOption } from './select';

export { Dialog } from './dialog';

export * from './shared/utils';
