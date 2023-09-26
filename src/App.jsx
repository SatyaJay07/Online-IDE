/* eslint-disable */
import { useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import Navbar from "./Navbar.jsx";
import Axios from "axios";
import spinner from "./spinner.svg";

function App() {
	// State variable to set users source code
	const [userCode, setUserCode] = useState(``);

	// State variable to set editors default language
	const [userLang, setUserLang] = useState("python");

	// State variable to set editors default theme
	const [userTheme, setUserTheme] = useState("vs-dark");

	// State variable to set editors default font size
	const [fontSize, setFontSize] = useState(20);

	// State variable to set users input
	const [userInput, setUserInput] = useState("");

	// State variable to set users output
	const [userOutput, setUserOutput] = useState("");

	// Loading state variable to show spinner
	// while fetching data
	const [loading, setLoading] = useState(false);

	const options = {
		fontSize: fontSize,
	};

	// Function to call the compile endpoint
	async function compile() {
		setLoading(true);
		
		if (userCode === ``) {
			return;
		}

		// Post request to compile endpoint
		const options = {
			method: "POST",
			url: "https://runit-api.p.rapidapi.com/execute",
			headers: {
				"content-type": "application/json",
				"X-RapidAPI-Key": "a63f01e84amsh0a882ba95cfa721p19a389jsn674a2ff004c9",
				"X-RapidAPI-Host": "runit-api.p.rapidapi.com",
			},
			data: {
				code: userCode,
				input: userInput,
				lang: "python38pr",
			},
		};

		try {
			const response = await Axios.request(options);
			setUserOutput(response.data.output);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	}

	// Function to clear the output screen
	function clearOutput() {
		setUserOutput("");
	}

	return (
		<div className="App">
			<Navbar
				userLang={userLang}
				setUserLang={setUserLang}
				userTheme={userTheme}
				setUserTheme={setUserTheme}
				fontSize={fontSize}
				setFontSize={setFontSize}
			/>
		
			<div className="main">
				<div className="left-container">
					<Editor
						options={options}
						height="calc(100vh - 50px)"
						width="100%"
						theme={userTheme}
						language={userLang}
						defaultLanguage="python"
						defaultValue="# Enter your code here"
						onChange={(value) => {
							setUserCode(value);
						}}
					/>
					<button className="run-btn" onClick={compile}>
						Run
					</button>
				</div>
				<div className="right-container">
					<h4>Input:</h4>
					<div className="input-box">
						<textarea
							id="code-inp"
							onChange={(e) => setUserInput(e.target.value)}
						></textarea>
					</div>
					<h4>Output:</h4>
					{loading ? (
						<div className="spinner-box">
							<img src={spinner} alt="Loading..." />
						</div>
					) : (
						<div className="output-box">
							<pre>{userOutput}</pre>
							<button
								onClick={clearOutput}
								className="clear-btn"
							>
								Clear
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
