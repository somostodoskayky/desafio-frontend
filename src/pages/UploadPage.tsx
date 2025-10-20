import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { uploadVideoWithProgress } from '../api/youtube';
import { AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineWarning, AiOutlinePlayCircle, AiOutlineArrowLeft } from 'react-icons/ai';

const UploadPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState('22');
    const [privacyStatus, setPrivacyStatus] = useState<'public' | 'unlisted' | 'private'>('unlisted');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            if (!selectedFile.type.startsWith('video/')) {
                setError('Please select a valid video file');
                return;
            }

            const maxSize = 256 * 1024 * 1024;
            if (selectedFile.size > maxSize) {
                setError('File size must be less than 256MB');
                return;
            }

            setFile(selectedFile);
            setError(null);

            const videoUrl = URL.createObjectURL(selectedFile);
            setFilePreview(videoUrl);

            if (!title) {
                const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
                setTitle(fileName);
            }
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleUpload = async () => {
        setError(null);
        setSuccessId(null);
        setUploadProgress(0);

        if (!file) {
            setError('Please select a video file.');
            return;
        }
        if (!title.trim()) {
            setError('Please provide a title.');
            return;
        }
        if (title.trim().length > 100) {
            setError('Title must be 100 characters or less.');
            return;
        }

        setLoading(true);
        setUploadStage('uploading');

        try {
            const videoMetadata = {
                title: title.trim(),
                description: description.trim(),
                tags: tags.split(',').map(t => t.trim()).filter(t => t),
                categoryId: category,
                privacyStatus,
            };

            const id = await uploadVideoWithProgress(
                file,
                videoMetadata,
                (progress) => {
                    setUploadProgress(progress);
                    if (progress >= 100) {
                        setUploadStage('processing');
                    }
                }
            );

            setSuccessId(id);
            setUploadStage('success');

            setTimeout(() => {
                navigate('/my-videos');
            }, 3000);
        } catch (e: any) {
            console.error('Upload error:', e);
            setError(e?.message || 'Upload failed. Please try again.');
            setUploadStage('error');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setFilePreview(null);
        setTitle('');
        setDescription('');
        setTags('');
        setUploadProgress(0);
        setUploadStage('idle');
        setError(null);
        setSuccessId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-youtube-dark p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <AiOutlineArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <AiOutlineCloudUpload className="w-8 h-8 text-youtube-red" />
                        <h1 className="text-white text-3xl font-bold">Upload Video</h1>
                    </div>
                    <p className="text-gray-400 mt-2">Share your content with the world</p>
                </div>
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-900/50 border border-red-700 text-red-200 text-sm flex items-start space-x-3">
                        <AiOutlineWarning className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}
                {successId && (
                    <div className="mb-6 p-4 rounded-lg bg-green-900/50 border border-green-700 text-green-200 text-sm flex items-start space-x-3">
                        <AiOutlineCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold mb-1">Upload Successful!</p>
                            <p className="text-xs text-green-300">Video ID: {successId}</p>
                            <p className="text-xs text-green-300 mt-1">Redirecting to My Videos...</p>
                        </div>
                    </div>
                )}
                {uploadStage !== 'idle' && (
                    <div className="mb-6 p-4 rounded-lg bg-youtube-gray border border-youtube-lightGray">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">
                                {uploadStage === 'uploading' && 'Uploading...'}
                                {uploadStage === 'processing' && 'Processing...'}
                                {uploadStage === 'success' && 'Complete!'}
                                {uploadStage === 'error' && 'Failed'}
                            </span>
                            <span className="text-gray-300 text-sm">{Math.round(uploadProgress)}%</span>
                        </div>

                        <div className="w-full bg-youtube-dark rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${uploadStage === 'success' ? 'bg-green-500' :
                                    uploadStage === 'error' ? 'bg-red-500' :
                                        'bg-youtube-red'
                                    }`}
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>

                        {uploadStage === 'processing' && (
                            <p className="text-gray-400 text-xs mt-2">
                                Your video is being processed by YouTube. This may take a few minutes.
                            </p>
                        )}
                    </div>
                )}

                <div className="bg-youtube-gray border border-youtube-lightGray rounded-xl p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-3">Video File *</label>

                                {!file ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-youtube-lightGray rounded-lg p-12 text-center cursor-pointer hover:border-youtube-red transition-colors"
                                    >
                                        <AiOutlineCloudUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-white text-lg mb-2">Click to select video</p>
                                        <p className="text-gray-400 text-sm">or drag and drop</p>
                                        <p className="text-gray-500 text-xs mt-3">MP4, AVI, MOV, WMV (Max 256MB)</p>
                                    </div>
                                ) : (
                                    <div className="border border-youtube-lightGray rounded-lg p-4 bg-youtube-dark">
                                        <div className="flex items-start space-x-4">
                                            {filePreview ? (
                                                <video
                                                    src={filePreview}
                                                    className="w-32 h-32 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 bg-youtube-gray rounded flex items-center justify-center">
                                                    <AiOutlinePlayCircle className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium truncate mb-1">{file.name}</p>
                                                <p className="text-gray-400 text-sm mb-3">{formatFileSize(file.size)}</p>
                                                <button
                                                    onClick={handleReset}
                                                    className="text-youtube-red text-sm hover:underline"
                                                    disabled={loading}
                                                >
                                                    Change video
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Title *</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-youtube-dark text-white px-4 py-3 rounded-lg border border-youtube-lightGray focus:border-youtube-red focus:outline-none"
                                    placeholder="Add a title that describes your video"
                                    maxLength={100}
                                    disabled={loading}
                                />
                                <p className="text-gray-400 text-xs mt-1">{title.length}/100</p>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-youtube-dark text-white px-4 py-3 rounded-lg border border-youtube-lightGray focus:border-youtube-red focus:outline-none resize-none"
                                    rows={5}
                                    placeholder="Tell viewers about your video"
                                    maxLength={5000}
                                    disabled={loading}
                                />
                                <p className="text-gray-400 text-xs mt-1">{description.length}/5000</p>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Tags</label>
                                <input
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full bg-youtube-dark text-white px-4 py-3 rounded-lg border border-youtube-lightGray focus:border-youtube-red focus:outline-none"
                                    placeholder="gaming, tutorial, vlog (comma separated)"
                                    disabled={loading}
                                />
                                <p className="text-gray-400 text-xs mt-1">Separate tags with commas</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-youtube-lightGray">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-youtube-dark text-white px-4 py-3 rounded-lg border border-youtube-lightGray focus:border-youtube-red focus:outline-none"
                                disabled={loading}
                            >
                                <option value="1">Film & Animation</option>
                                <option value="2">Autos & Vehicles</option>
                                <option value="10">Music</option>
                                <option value="15">Pets & Animals</option>
                                <option value="17">Sports</option>
                                <option value="19">Travel & Events</option>
                                <option value="20">Gaming</option>
                                <option value="22">People & Blogs</option>
                                <option value="23">Comedy</option>
                                <option value="24">Entertainment</option>
                                <option value="25">News & Politics</option>
                                <option value="26">Howto & Style</option>
                                <option value="27">Education</option>
                                <option value="28">Science & Technology</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Privacy</label>
                            <select
                                value={privacyStatus}
                                onChange={(e) => setPrivacyStatus(e.target.value as any)}
                                className="w-full bg-youtube-dark text-white px-4 py-3 rounded-lg border border-youtube-lightGray focus:border-youtube-red focus:outline-none"
                                disabled={loading}
                            >
                                <option value="public">Public - Everyone can watch</option>
                                <option value="unlisted">Unlisted - Anyone with the link</option>
                                <option value="private">Private - Only you</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            className="px-6 py-3 rounded-lg bg-youtube-lightGray text-white hover:bg-youtube-dark transition-colors font-medium"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-8 py-3 rounded-lg bg-youtube-red text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                            onClick={handleUpload}
                            disabled={loading || !file || !title.trim()}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <AiOutlineCloudUpload className="w-5 h-5" />
                                    <span>Upload Video</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
