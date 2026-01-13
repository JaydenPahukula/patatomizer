import { EditorState, type Extension } from '@codemirror/state';

/** Codemirror extension that enforces that the editor only has one line */
export const oneLineExtension: Extension = EditorState.transactionFilter.of((tr) => (tr.newDoc.lines > 1 ? [] : tr));
