import { EditorState } from '@codemirror/state';
import { type Extension } from '@codemirror/state';

/** Enforces that the editor only has one line */
export const oneLineExtension: Extension = EditorState.transactionFilter.of((tr) => (tr.newDoc.lines > 1 ? [] : tr));
