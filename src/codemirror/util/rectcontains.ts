import type { Rect } from '@codemirror/view';

export function rectContains(rect: Rect, { x, y }: { x: number; y: number }): boolean {
	return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
