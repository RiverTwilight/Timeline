import { h, Component, render, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";

const EmptyHint = () => (
	<div class="bg-white p-4 rounded-xl flex flex-col justify-center h-56">
		<p class="text-gray-700 mt-1 w-full font-bold text-xl text-center">
			No Record Yet
		</p>
		<p class="text-gray-700 w-full text-base text-center">
			Take a look at x.com and check back later
		</p>
	</div>
);

export default EmptyHint;
