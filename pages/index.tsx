import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect} from "react";
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { FileRejection, useDropzone } from 'react-dropzone';
import logo from './main.png';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	
	const [url, setUrl] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
  	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [token, setToken] = useState<string>("");
	const videos = 
	[
        {
            name: 'Video 1',
            thumbnail: 'https://example.com/video1-thumbnail.jpg',
            videoUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8'
        },
        {
            name: 'Video 2',
            thumbnail: 'https://example.com/video2-thumbnail.jpg',
            videoUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8'
		},
		        {
            name: 'Video 1',
            thumbnail: 'https://example.com/video1-thumbnail.jpg',
            videoUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8'
        },
        {
            name: 'Video 2',
            thumbnail: 'https://example.com/video2-thumbnail.jpg',
            videoUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
		},
	]

	useEffect(() => {
		console.log('useeffect')
		getToken();
	  }, []);

	const handleFileChange = (event:any) => {
	  console.log(event.target.files[0]);
	  const file = event.target.files[0];
	  setSelectedFile(file);
	};
	
	const getToken = async () => {
	  try {
		const response = await fetch('http://mts.alobanov.space:8000/token');
  
		if (!response.ok) {
		  throw new Error('Failed to get token from server');
		}
  
		const token = await response.text();
		setToken(token);
		console.log(token)
		console.log('hello')
	  } catch (error) {
		console.error(error);
		setToken("");
	  }
	};

	const handleUploadClick = async () => {
		if (selectedFile) {
		  setIsLoading(true);
	
		  const formData = new FormData();
		  formData.append('token', "7f52f208549947b96bfdc2ca6bcbef59");
		  console.log(selectedFile);
		  formData.append('video', selectedFile);
		  
		  try {
			const response = await fetch('http://mts.alobanov.space:8000/from-video', {
			  method: 'POST',
			  body: formData,
			});
	
			// convert the response blob to a temporary URL
			const videoBlob = await response.blob();
			const url = URL.createObjectURL(videoBlob);
			setUrl(url);
		  } catch (error) {
			// handle network error
			console.error('Network error:', error);
		  }
	
		  setIsLoading(false);
		}
	};
	
  
	const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	  setUrl(event.target.value);
	};

	const sendRequest = (event: any) => {
		console.log(url)
	}

	const downloadVideo = (event: any) => {
		console.log(url)
	}

	function changeFirstParam(someParam: string) {
		console.log(someParam)
	}

	function changeUrl(newUrl: string){
		setUrl(newUrl)
	}

	const listItems = videos.map(video =>
		<li key={video.name}>
						<button
						className={styles.buttoncard}
						type="button"
						onClick={() => changeUrl(video.videoUrl)}
						>
						<h2 className={inter.className}>
						{video.name} <span>-&gt;</span>
						</h2>
						<img src={'https://picsum.photos/200/300/?blur'} height='200px' width='100px' />
						<p className={inter.className}>
						Find in-depth information about Next.js features and&nbsp;API.
						</p>
						</button>
		</li>
	  );
	const chooseMovie = (event: any) => {
		console.log(url)
	}

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
	  <button className={styles.button} type="button" onClick={sendRequest}></button>
      <main className={styles.main}>

			<div>
				<ul>{listItems}</ul>
			</div>
			
			<div>
					<div className={styles.gridtop}>

						<div className={styles.searchbar}>
							<input
							type="text"
							className={styles.input}
							placeholder="Введите ссылку на стрим или видео"
							value={url}
							onChange={handleUrlChange}
							/>
						</div>

					</div>

					<div className={styles.gridtop}>
						<form>
							<input className={styles.buttoncard} type="file" onChange={handleFileChange} />
						</form>
						<button className={styles.buttoncard} onClick={handleUploadClick}>
							{isLoading ? 'Uploading...' : 'Обработать видео'}
						</button>
					</div>
					<div className={styles.gridmiddle}>

						<button
						className={styles.buttoncard}
						type="button"
						onClick={() => changeFirstParam('мужской')}
						>
									<h2 className={inter.className}>
									Мужской голос
									</h2>
						</button>

						<button
						className={styles.buttoncard}
						type="button"
						onClick={() => changeFirstParam('женский')}
						>
									<h2 className={inter.className}>
									Женский голос
									</h2>
						</button>

					</div>

				<div className={styles.gridvideo}>
				<ReactPlayer 
				playing 
				url={url}
				width='100%'
				height='100%'
				controls={true}
				/>
				</div>
			</div>

      </main>
    </>
  )
}
