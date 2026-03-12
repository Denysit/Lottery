import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import "./App.css";
import logo from "./assets/logo.png";
import spinAudioFile from "./assets/Voicy_Casino_fruit_machine_handle_pull.mp3";
import victoryAudioFile from "./assets/universfield-level-up-08-402152.mp3";


const App = () => {
	const [rotation, setRotation] = useState(0);
	const [isSpinning, setIsSpinning] = useState(false);
	const [prize, setPrize] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const spinSound = useRef(new Audio(spinAudioFile));
	const winSound = useRef(new Audio(victoryAudioFile));


	const segments = [20, 15, 8, 10, 15, 50, 10, 15, 8, 10];

	const calculateResult = () => {
		const rand = Math.random() * 100;

		// 99% шанс
		if (rand < 99) return 8;

		// 1% шанс на будь-яке інше число
		const other = segments.filter(v => v !== 8);
		return other[Math.floor(Math.random() * other.length)];
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
		spinSound.current.currentTime = 0;
		spinSound.current.play().catch(() => { });
		setTimeout(() => {
			spinSound.current.pause();
			spinSound.current.currentTime = 0;
		}, 4000);

		setTimeout(() => {
			setIsSpinning(false);
			setPrize(winValue);
			setShowModal(true);
			winSound.current.currentTime = 0;
			winSound.current.play().catch(() => { });
			setTimeout(() => {
				winSound.current.pause();
				winSound.current.currentTime = 0;
			}, 4000);
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
