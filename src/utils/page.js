class Page {
	url;
	originalPage;
	constructor(url) {
		// const userinfo =
		// 	document.querySelectorAll(".leftuser01 td")[1].innerText;

		// console.log(userinfo);

		this.url = url;
		this.hideOriginalPage();
	}

	hideOriginalPage() {
		const container = document.createElement("div");

		container.innerHTML = document.body.innerHTML;
		this.originalPage = container;

		container.remove();
		document.body.innerHTML = "";
	}
}

export default Page;
