import { getUser } from '../utils'

// BUTTONS & INPUTS
// prettier-ignore
import { Button, Flex, FormLabel, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { IoCheckmark, IoChevronDown, IoCloudUpload, IoLocation, IoTrash, IoWarning } from 'react-icons/io5'

import { categories } from '../data'

// SPINNER, ALERT, EDITOR
import Spinner from './Spinner'
import AlertMsg from './AlertMsg'
import { Editor } from '@tinymce/tinymce-react'

// FIREBASE
import { getStorage, ref, upload, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { firebaseApp } from '../firebase-config'

// FIRESTORE
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { Navigate, useNavigate } from 'react-router-dom'
const firestoreDB = getFirestore(firebaseApp)

const Create = () => {
	const { colorMode } = useColorMode()
	const bg = useColorModeValue('gray.50', 'gray.900')
	const textColor = useColorModeValue('gray.900', 'gray.50')

	const editorRef = useRef(null)

	const [title, setTitle] = useState('')
	const [category, setCategory] = useState('Choose a category')
	const [location, setLocation] = useState('')
	const [videoAsset, setVideoAsset] = useState(null)
	const [loading, setLoading] = useState(false)
	const [progress, setProgress] = useState(1)
	const [alert, setAlert] = useState(false)
	const [alertStatus, setAlertStatus] = useState('')
	const [alertMsg, setAlertMsg] = useState('')
	const [alertIcon, setAlertIcon] = useState(null)
	const [description, setDescription] = useState('')

	const [userInfo] = getUser()
	const navigate = useNavigate()

	const storage = getStorage(firebaseApp)

	const uploadImage = (e) => {
		setLoading(true)
		const videoFile = e.target.files[0]

		const storageRef = ref(storage, `Videos/${Date.now()}-${videoFile.name}`)

		const uploadTask = uploadBytesResumable(storageRef, videoFile)

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				setProgress(uploadProgress)
			},
			(error) => {
				console.log(error)
			},
			// Successful uploads
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setVideoAsset(downloadURL)
					setLoading(false)
					setAlert(true)
					setAlertStatus('success')
					setAlertIcon(<IoCheckmark fontSize={25} />)
					setAlertMsg('Your video has been uploaded')
					setTimeout(() => {
						setAlert(false)
					}, 4000)
				})
			},
		)
	}

	const deleteImage = () => {
		const deleteRef = ref(storage, videoAsset)
		deleteObject(deleteRef)
			.then(() => {
				setVideoAsset(null)
				setAlert(true)
				setAlertStatus('warning')
				setAlertIcon(<IoWarning fontSize={25} />)
				setAlertMsg('Your video was removed')
				setTimeout(() => {
					setAlert(false)
				}, 4000)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const getDescriptionValue = () => {
		if (editorRef.current) {
			console.log(editorRef.current.getContent())
			setDescription(editorRef.current.getContent())
		}
	}

	const uploadDetails = async () => {
		try {
			setLoading(true)
			if (!title && !category && !videoAsset) {
				setAlert(true)
				setAlertStatus('error')
				setAlertIcon(<IoWarning fontSize={25} />)
				setAlertMsg('Required Fields are missing')
				setTimeout(() => {
					setAlert(false)
				}, 3000)
			} else {
				const data = {
					id: `${Date.now()}`,
					title,
					userId: userInfo?.uid,
					category,
					location,
					videoUrl: videoAsset,
					description,
				}
				await setDoc(doc(firestoreDB, 'Videos', `${Date.now()}`), data)
				setLoading(false)
				navigate('/', { replace: true })
			}
			setLoading(false)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {}, [title, location, description, category])

	return (
		<Flex justifyContent={'center'} alignItems={'center'} width={'100vw'} minHeight='100vh' padding={10}>
			<Flex
				width={'80%'}
				height='full'
				border={'1px'}
				borderColor='gray.300'
				borderRadius={'md'}
				p='4'
				flexDirection={'column'}
				alignItems={'center'}
				justifyContent={'center'}
				gap={2}>
				{alert && <AlertMsg status={alertStatus} msg={alertMsg} icon={alertIcon} />}

				{/* title input */}
				<Input
					variant={'flushed'}
					placeholder='title'
					focusBorderColor='gray.400'
					isRequired
					errorBorderColor='red'
					type={'text'}
					_placeholder={{ color: 'gray.500' }}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				{/* category selection */}
				<Flex justifyContent={'space-between'} width='full' alignItems={'center'} gap={8} my={4}>
					<Menu>
						<MenuButton width={'full'} colorScheme='blue' as={Button} rightIcon={<IoChevronDown fontSize={25} />}>
							{category}
						</MenuButton>
						<MenuList zIndex={101} width={'xs'} shadow='xl'>
							{categories &&
								categories.map((data) => (
									<MenuItem key={data.id} _hover={{ bg: 'blackAlpha.300' }} fontSize={20} px={4} onClick={() => setCategory(data.name)}>
										{data.iconSrc}{' '}
										<Text fontSize={18} ml={4}>
											{data.name}
										</Text>
									</MenuItem>
								))}
						</MenuList>
					</Menu>

					{/* location input */}
					<InputGroup>
						<InputLeftElement
							pointerEvents='none'
							children={<IoLocation fontSize={20} color={`${colorMode === 'dark' ? '#f1f1f1' : '#111'}`} />}
						/>
						<Input
							variant={'flushed'}
							placeholder='location'
							focusBorderColor='gray.400'
							isRequired
							errorBorderColor='red'
							type={'text'}
							_placeholder={{ color: 'gray.500' }}
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
					</InputGroup>
				</Flex>

				{/* File Selection */}
				<Flex
					border={'1px'}
					borderColor='gray.500'
					height={'400px'}
					borderStyle='dashed'
					width='full'
					borderRadius={'md'}
					overflow={'hidden'}
					position={'relative'}>
					{!videoAsset ? (
						<FormLabel width='full'>
							<Flex direction={'column'} alignItems='center' justifyContent={'center'} height='full' width={'full'}>
								<Flex direction={'column'} alignItems='center' justifyContent={'center'} height='full' width={'full'} cursor='pointer'>
									{loading ? (
										<Spinner msg={'Uploading your Video'} progress={progress} />
									) : (
										<>
											<IoCloudUpload fontSize={30} color={`${colorMode === 'dark' ? '#f1f1f1' : '#111'}`} />
											<Text mt={5} fontSize={20} color={textColor}>
												Click to upload
											</Text>
										</>
									)}
								</Flex>
							</Flex>
							{!loading && (
								<input
									type='file'
									name='upload-image'
									onChange={uploadImage}
									style={{ width: 0, height: 0 }}
									accept='video/mp4, video/x-m4v, video/*'
								/>
							)}
						</FormLabel>
					) : (
						<Flex width={'full'} height={'full'} justifyContent={'center'} alignItems={'center'} bg='black' position={'relative'}>
							<Flex
								justifyContent={'center'}
								alignItems={'center'}
								width={'40px'}
								height={'40px'}
								rounded='full'
								bg={'red'}
								top={5}
								right={5}
								position={'absolute'}
								cursor={'pointer'}
								zIndex={10}
								onClick={deleteImage}>
								<IoTrash fontSize={20} color='white' />
							</Flex>

							<video src={videoAsset} controls style={{ width: '100%', height: '100%' }}></video>
						</Flex>
					)}
				</Flex>

				<Editor
					onChange={getDescriptionValue}
					onInit={(evt, editor) => (editorRef.current = editor)}
					apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
					init={{
						height: 500,
						width: '100%',
						menubar: false,
						plugins: [
							'advlist autolink lists link image charmap print preview anchor',
							'searchreplace visualblocks code fullscreen',
							'insertdatetime media table paste code help wordcount',
						],
						toolbar:
							'undo redo | formatselect | ' +
							'bold italic backcolor | alignleft aligncenter ' +
							'alignright alignjustify | bullist numlist outdent indent | ' +
							'removeformat | help',
						content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
						content_css: 'dark',
						skin: 'oxide-dark',
					}}
				/>

				<Button
					isLoading={loading}
					loadingText='Uploading'
					colorScheme='linkedin'
					variant={`${loading ? 'outline' : 'solid'}`}
					width={'x1'}
					_hover={{ shadow: 'lg' }}
					fontSize={20}
					onClick={() => uploadDetails()}>
					Upload
				</Button>
			</Flex>
		</Flex>
	)
}

export default Create
