import { defineConfig } from 'vite';
import htmlInject from 'vite-plugin-html-inject';
import { resolve } from 'path';

export default defineConfig({
	plugins: [htmlInject()],
	resolve: {
		alias: {
			src: resolve(__dirname, 'src'),
		},
	},
});
