import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import typescript from "@rollup/plugin-typescript";
import { babel } from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";
import banner from "rollup-plugin-banner";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const plugins = [
	alias({
		entries: [
			{ find: "react", replacement: "preact/compat" },
			{
				find: "react-dom/test-utils",
				replacement: "preact/test-utils",
			},
			{ find: "react-dom", replacement: "preact/compat" },
			{
				find: "react/jsx-runtime",
				replacement: "preact/jsx-runtime",
			},
		],
	}),
	nodeResolve({ extensions }),
	commonjs(),
	babel({
		babelHelpers: "bundled",
		extensions,
		include: ["src/**/*"],
		plugins: [
			[
				"@babel/plugin-transform-react-jsx",
				{
					pragma: "h",
					pragmaFrag: "Fragment",
				},
			],
		],
	}),
];

export default [
	{
		input: "src/index.chrome.js",
		output: [
			{
				file: "dist/content.bundle.cjs.js",
				format: "cjs",
				sourcemap: false,
			},
			// {
			// 	file: "dist/content.bundle.esm.js",
			// 	format: "esm",
			// 	sourcemap: true,
			// },
		],
		plugins: plugins,
	},
	{
		input: "src/index.tampermonkey.js",
		output: [
			{
				file: "tampermonkey/bundle.js",
				format: "cjs",
				sourcemap: false,
			},
		],
		preserveSymlinks: true,
		plugins: [...plugins],
	},
];
