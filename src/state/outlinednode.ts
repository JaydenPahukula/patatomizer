import type { SyntaxNode } from '@lezer/common';
import { State } from 'src/state/state';

/** Global state for the node in the syntax tree that is currently hovered */
export const outlinedNodeState = new State<SyntaxNode | null>(null);
