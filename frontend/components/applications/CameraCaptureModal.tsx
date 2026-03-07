'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface CameraCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
    stakeholderName: string;
}

export default function CameraCaptureModal({ isOpen, onClose, onCapture, stakeholderName }: CameraCaptureModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isStreamActive, setIsStreamActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsStreamActive(false);
    }, []);

    // Handle open/close side effects
    useEffect(() => {
        let isCancelled = false;

        const initCamera = async () => {
            setError(null);
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' },
                    audio: false
                });

                if (isCancelled) {
                    mediaStream.getTracks().forEach(t => t.stop());
                    return;
                }

                streamRef.current = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().catch(e => console.error("Play error:", e));
                    };
                }
                setIsStreamActive(true);
            } catch (err: any) {
                if (!isCancelled) {
                    console.error("Error accessing camera:", err);
                    setError(err.message || 'Unable to access camera. Please check permissions.');
                }
            }
        };

        if (isOpen && !capturedImage) {
            initCamera();
        } else {
            stopCamera();
        }

        return () => {
            isCancelled = true;
            stopCamera();
        };
    }, [isOpen, capturedImage, stopCamera, retryCount]);

    if (!isOpen) return null;

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current && isStreamActive) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            if (context) {
                // Draw video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                // Convert canvas to data URL
                const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(imageUrl);
                stopCamera();
            }
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        // Effect will automatically restart camera because capturedImage becomes null
    };

    const handleConfirm = async () => {
        if (capturedImage) {
            try {
                // Convert data URL to Blob, then to File
                const res = await fetch(capturedImage);
                const blob = await res.blob();
                const file = new File([blob], `kyc_selfie_${Date.now()}.jpg`, { type: 'image/jpeg' });
                onCapture(file);
                onClose();
                setCapturedImage(null);
                stopCamera();
            } catch (err) {
                console.error("Failed to convert image to file", err);
                setError("Failed to process image. Please try again.");
            }
        }
    };

    const handleCancel = () => {
        setCapturedImage(null);
        stopCamera();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-gray-900">Live Photo Verification: {stakeholderName}</h3>
                    <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 flex-1 bg-gray-50 flex flex-col items-center justify-center min-h-[300px] relative">
                    {error ? (
                        <div className="text-center p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 w-full">
                            <svg className="w-8 h-8 mx-auto mb-2 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p className="font-medium">{error}</p>
                            <button onClick={() => setRetryCount(c => c + 1)} className="mt-4 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-50">Retry Camera</button>
                        </div>
                    ) : capturedImage ? (
                        <img src={capturedImage} alt="Captured preview" className="w-full h-auto rounded-xl object-cover border-4 border-white shadow-md" />
                    ) : (
                        <div className="relative w-full aspect-[3/4] sm:aspect-video rounded-xl overflow-hidden bg-black shadow-inner border-4 border-white">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                            />
                            {/* Face outline guide */}
                            <div className="absolute inset-0 border-[6px] border-white/20 pointer-events-none z-10"></div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <div className="w-3/5 h-3/5 border-2 border-dashed border-white/50 rounded-full"></div>
                            </div>
                        </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="p-4 border-t border-gray-100 bg-white flex gap-3 justify-end">
                    {capturedImage ? (
                        <>
                            <button
                                onClick={handleRetake}
                                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                Retake
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 px-4 py-3 bg-[#494FBB] hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#494FBB]/20"
                            >
                                Use Photo
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleCancel}
                                className="px-5 py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCapture}
                                disabled={!!error || !isStreamActive}
                                className="flex-1 px-4 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#10b981]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="4" /><path d="M22 8v10a2 20 0 0 1-2 2H4a2 20 0 0 1-2-2V8a2 20 0 0 1 2-2h2l1.3-3.1A2 20 0 0 1 9.1 2h5.8a2 20 0 0 1 1.8 1.9L18 6h2a2 20 0 0 1 2 2z" /></svg>
                                Take Photo
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
