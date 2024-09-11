import {useIntl} from "react-intl";
import React, { useEffect } from 'react';
import NotificationManager from '../notifications/NotificationManager';
import { useDropzone, DropzoneOptions, DropzoneState, FileError, FileRejection } from 'react-dropzone';

import './style.scss';
import { formatFileSize } from '../../commons/helpers/funcHelper';
import A11yButton from '../A11yButton';
import Icon from '../icon/Icon';

export type DragAndDropProps = {
	// Allowed types
	// e.g ['image/*', video.mp4']
	types: Array<string>;
	// Maximum files allowed
	maxFiles: number;
	// Text to display inside the box
	text?: string | React.ReactElement;
	options?: DropzoneOptions,
	// Custom render
	children?: (wrapperProps: any, dropzoneProps: Partial<DropzoneState>) => React.ReactElement;

	/* These 2 properties are use to control the component */
	// Hold dropped files
	files: Array<FileItem>,
	// Update files array
	setFiles: (files: FileItem[]) => void
};

export type FileItem = File & {
	preview?: string;
}

/**
 * This is control component. So you must properly set and use files and setFiles
 * @param onFilesChanged
 * @param types e.g ['image/*', video.mp4', '.xlx']
 * @param maxFiles
 */
const DragAndDrop = ({options, types, maxFiles, text, files, setFiles, children}: DragAndDropProps) => {
	const intl = useIntl();
	const _text = text || intl.formatMessage({id: "dragAndDrop.defaultText"})

	const _options: DropzoneOptions = {
		accept: types.join(', '),
		/**
		 * Get executed when a uploading/dropping occurred
		 * @param acceptedFiles
		 */
		onDrop: (acceptedFiles: Array<File>) => {
			let _files = [...acceptedFiles.map(file => Object.assign(file, {
				preview: URL.createObjectURL(file)
			})), ...files];

			if (maxFiles && _files.length > maxFiles) {
				_files = _files.slice(0, maxFiles);
			}

			setFiles(_files);
		},
		/**
		 * Display error message when errors occur while uploading/dropping
		 * @param rejectedFiles FileRejection[]
		 */
		onDropRejected: (rejectedFiles: FileRejection[]) => {
			let foundError = false;
			for(let i = 0; i < rejectedFiles.length; i++) {
				const file = rejectedFiles[i];
				if (file.errors.length > 0) {
					foundError = true;
					file.errors.forEach((error: FileError) => {
						switch (error.code) {
							case "file-invalid-type":
								NotificationManager.error(intl.formatMessage({id: "file.errors.fileInvalidType"}));
								break;
							case "file-too-large":
								NotificationManager.error(intl.formatMessage({id: "file.errors.fileTooLarge"}));
								break;
							case "file-too-small":
								NotificationManager.error(intl.formatMessage({id: "file.errors.fileTooSmall"}));
								break;
							case "too-many-files":
								NotificationManager.error(intl.formatMessage({id: "file.errors.tooManyFiles"}, {count: maxFiles}));
								break;
							default:
								NotificationManager.error(intl.formatMessage({id: "file.errors.others"}));
								break;
						}
					});
				}

				if (foundError)
					break;
			}
		},
		...(options || {})
	};

	if (maxFiles) {
		_options.maxFiles = maxFiles;
	}

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
		...dropzoneProps
	} = useDropzone(_options);

	const onRemoveThumb = (file: FileItem) => {
		setFiles(files.filter(_file => `${_file.name + _file.lastModified}` !== `${file.name + file.lastModified}`))
	};

	const thumbs = files.map((file, index) => {
		let render = null;
		const floating = (
			<A11yButton<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
				elementType="div"
				onClick={() => onRemoveThumb(file)}
				className="close-btn cursor-pointer center-hor-ver">
				<Icon icon='Close' className='text-white' size='2x' />
			</A11yButton>
		);

		if (file.type.includes('video')) {
			render = (
				<div className="thumb-item">
					<div className="thumb-wrap">
						{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
						<video id="video" width="400" controls className="thumb-elt">
							<source src={file.preview}/>
						</video>
					</div>
					{floating}
				</div>
			);
		} else if (file.type.includes('image')) {
			render = (
				<div className="thumb-item w-100 h-auto">
					<div className="thumb-wrap">
						<img
							alt="preview"
							src={file.preview}
							className="img thumb-elt w-100 h-auto"
						/>
					</div>
					{floating}
				</div>
			);
		} else {
			render = (
				<div className="thumb-item raw-file w-100 h-auto">
					<div className="thumb-wrap">
						<div>
							<p>{formatFileSize(file.size).formattedSize}</p>
							<p>{file.name}</p>
						</div>
					</div>
					{floating}
				</div>
			)
		}

		return (
			<div key={index} className='w-100 h-auto'>
				{render}
			</div>
		);
	});

	useEffect(() => () => {
		// Make sure to revoke the data uris to avoid memory leaks
		files.forEach(file => file.preview ? URL.revokeObjectURL(file.preview) : null);
	}, [files]);

	if (children) {
		return (
			<>
				<input className='input' {...getInputProps()} />
				{children(
					{...getRootProps({isDragActive, isDragAccept, isDragReject})},
					{isDragActive, isDragAccept, isDragReject, ...dropzoneProps}
				)}
			</>
		);
	}

	return (
		<div className="">
			<div className="custom-dnd-zone w-100 h-auto" {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
				<input className='input' {...getInputProps()} />
				<p>{_text}</p>
				<A11yButton<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
					elementType="aside"
					style={{display: 'flex',
						flexDirection: 'row',
						flexWrap: 'wrap',
						marginTop: 16}}
					// className="thumbs-container"
					onClick={(event) => event.stopPropagation()}>
					{thumbs}
				</A11yButton>
			</div>
		</div>
	);
};

DragAndDrop.defaultProps = {
	maxFiles: 1,
	types: [],
};

export default React.memo(DragAndDrop);
