import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ReactPictureAnnotation } from 'react-picture-annotation';
import { Box } from '@chakra-ui/react'


function App() {

	const [pageSize, setPageSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight
	});

	const onResize = () => {
		setPageSize({ width: window.innerWidth, height: window.innerHeight });
	};

	useEffect(() => {
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	return (
		<div className="App">
			<ReactPictureAnnotation
				image="https://source.unsplash.com/random/"
				onSelect={(selectedId)=>{console.log(selectedId)}}
				onChange={(data)=>{console.log(data)}}
				width={600}
				height={600}
			/>

		</div>
	);
}

export default App;
