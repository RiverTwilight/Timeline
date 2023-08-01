import { render, h, Component } from "preact";
import { useState, useEffect } from "preact/hooks";
import Page from "../../utils/page";
import getImage from "../../utils/getImage";

const LoginForm = ({ handleFocus }) => {
	const [codeImg, setCodeImg] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	useEffect(() => {
		setCodeImg(`/validateCodeAction.do?random=${Math.random()}`);
	}, []);

	return (
		<form method="post" name="loginForm" action="/loginAction.do">
			<input type="hidden" name="zjh1" />
			<input type="hidden" name="tips" />
			<input type="hidden" name="lx" />
			<input type="hidden" name="evalue" />
			<input type="hidden" name="eflag" />
			<input type="hidden" name="fs" />
			<input type="hidden" name="dzslh"></input>
			<div className="W(100%)">
				<label for="username">帐号</label>
				<input
					type="text"
					name="zjh"
					id="username"
					className="MW(100%)"
					onChange={(e) => {
						console.log(e);
						setUsername(e.target.value);
					}}
					value={username}
					alt="notnull"
				></input>
			</div>

			<div>
				<label for="password">密码</label>
				<input
					type="password"
					name="mm"
					id="password"
					onFocus={() => {
						handleFocus(true);
					}}
					onBlur={() => {
						handleFocus(false);
					}}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
					value={password}
					alt="notnull"
					className="MW(100%)"
				></input>
			</div>

			<br />

			<label for="validation">验证码</label>

			<div className="DIS(flex) ub-validationField">
				<input
					id="validation"
					type="text"
					name="v_yzm"
					autoComplete="off"
					maxLength="4"
					alt="notnull"
				></input>
				<div className="ub-validationImg">
					<img
						src={codeImg}
						height="100%"
						width="100%"
						id="vchart"
					></img>
				</div>
			</div>

			<br></br>

			<div className="MTB(10px) DIS(flex) JC(center) FD(column)">
				<div className="DIS(flex) JC(center) FD(column) W(100%)">
					<button onClick={() => login()}>登录</button>
					{/* <a onClick={() => login()}>重设</a> */}
				</div>
			</div>
		</form>
	);
};

const MainView = () => {
	const [focus, setFocus] = useState(false);

	return (
		<div style={{ height: "100vh" }}>
			<div className="DIS(flex) JC(center) FD(row) H(100%)">
				<div id="neko-warpper">
					{focus && (
						<img
							className="hider"
							src={getImage("/img/hide.webp")}
							alt="URP"
							border="0"
						/>
					)}
					{!focus && (
						<img
							className="hider"
							src={getImage("/img/look.webp")}
							alt="URP"
							border="0"
						/>
					)}
				</div>

				<div className="DIS(flex) JC(center) FD(column)">
					<div className="ub-loginBox">
						<a className="darkOnly" href="">
							<img
								src={getImage(
									"/img/logo_landscape_dark.png"
								)}
								alt="URP"
								border="0"
							/>
						</a>
						<a className="lightOnly" href="">
							<img
								src={getImage(
									"/img/logo_landscape_light.png"
								)}
								alt="URP"
								border="0"
							/>
						</a>
						<LoginForm handleFocus={setFocus} />
						<p className="copyright">
							版权所有 © 北京清元优软科技有限公司
							<br></br>
							保留所有权利。
							<br></br>
							Redesign with ❤️ By &nbsp;
							<a href="https://github.com/rivertwilight">
								@RiverTwilight
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

class LoginPage extends Page {
	constructor() {
		super();
		this.url = "/login";
		this.title = "Login";
		this.content = "Login Page";
		this.mixOriginalPage();
		this.injectNewPage();
	}

	mixOriginalPage() {
		this.originalPage.getElementsByTagName("form").item(0).name =
			"_loginForm";
	}

	injectNewPage() {
		render(<MainView />, document.body);
	}
}

export default LoginPage;
