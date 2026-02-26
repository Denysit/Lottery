import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import "./App.css";
import logo from "./assets/logo.png";

const App = () => {
	const [rotation, setRotation] = useState(0);
	const [isSpinning, setIsSpinning] = useState(false);
	const [prize, setPrize] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const spinSound = useRef(
		new Audio("https://www.soundjay.com/misc/sounds/wheel-fortune-1.mp3"),
	);
	const winSound = useRef(
		new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"),
	);

	const segments = [20, 15, 8, 10, 15, 50, 10, 15, 8, 10];

	const calculateResult = () => {
		const rand = Math.random() * 100;

		const probabilities = [
			{ value: 50, chance: 0.1 },
			{ value: 20, chance: 10 },
			{ value: 15, chance: 22.9 },
			{ value: 10, chance: 42 },
			{ value: 8, chance: 25 },
		];

		let cumulative = 0;

		for (let item of probabilities) {
			cumulative += item.chance;
			if (rand < cumulative) return item.value;
		}
	};


	const spinWheel = () => {
		if (isSpinning) return;
		const winValue = calculateResult();
		const potentialIndices = segments.reduce(
			(acc, val, i) => (val === winValue ? [...acc, i] : acc),
			[],
		);
		const targetIndex =
			potentialIndices[Math.floor(Math.random() * potentialIndices.length)];

		const segmentAngle = 360 / segments.length;
		const targetAngle = 360 - targetIndex * segmentAngle - segmentAngle / 2;
		const totalRotation = rotation + 360 * 7 + (targetAngle - (rotation % 360));

		setIsSpinning(true);
		setRotation(totalRotation);
		spinSound.current.play().catch(() => { });

		setTimeout(() => {
			setIsSpinning(false);
			setPrize(winValue);
			setShowModal(true);
			winSound.current.play().catch(() => { });
			confetti({
				particleCount: 150,
				spread: 70,
				origin: { y: 0.6 },
				colors: ["#ff85b3", "#ffffff"],
			});
		}, 4000);
	};

	return (
		<div className="app-container">
			{/* Падаючі пелюстки */}
			{[...Array(25)].map((_, i) => (
				<div
					key={i}
					className="petal"
					style={{
						left: `${Math.random() * 100}%`,
						animationDelay: `${Math.random() * 5}s`,
						animationDuration: `${6 + Math.random() * 4}s`,
					}}
				>
					🌸
				</div>
			))}

			<div className="phone-screen">
				<h1 className="header-title">
					Весняне Колесо
					<br />
					Знижок
				</h1>

				<div className="wheel-main-container">
					<div className="wheel-pointer">▼</div>

					<div className="wheel-outer-border">
						{/* Декоративні білі крапки по колу як на фото */}
						{[...Array(20)].map((_, i) => (
							<div
								key={i}
								className="dot"
								style={{ transform: `rotate(${i * 18}deg)` }}
							></div>
						))}

						<div
							className="wheel-canvas"
							style={{ transform: `rotate(${rotation}deg)` }}
						>
							{segments.map((val, i) => (
								<div key={i} className="wheel-segment" style={{ "--i": i }}>
									<span className="segment-value">{val}%</span>
								</div>
							))}

						</div>
						<div className="wheel-center-logo">
							<img className="logo" src={logo} alt="Logo" width={250} height={240} />
						</div>
					</div>
				</div>

				<button
					className="main-spin-btn"
					onClick={spinWheel}
					disabled={isSpinning}
				>
					{isSpinning ? "Крутимо..." : "Крутити"}
					<span className="btn-bow">🎀</span>
				</button>
			</div>

			{showModal && (
				<div className="modal-overlay">
					<div className="modal-box">
						<div className="modal-deco">🌸</div>
						<p className="modal-label">Ваша знижка</p>
						<h2 className="modal-prize-text">{prize}%</h2>
						<button className="modal-close" onClick={() => setShowModal(false)}>
							Закрити
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
