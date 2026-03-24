import { useState } from "react";
import { Upload, File, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
    label: string;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    onFilesChange: (files: File[]) => void;
    files: File[];
    preview?: boolean;
}

export function FileUpload({
    label,
    accept = "*",
    multiple = false,
    maxSize = 5,
    onFilesChange,
    files,
    preview = false,
}: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            handleFiles(selectedFiles);
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const validFiles = newFiles.filter((file) => {
            const sizeMB = file.size / (1024 * 1024);
            return sizeMB <= maxSize;
        });

        if (multiple) {
            onFilesChange([...files, ...validFiles]);
        } else {
            onFilesChange(validFiles.slice(0, 1));
        }
    };

    const removeFile = (index: number) => {
        onFilesChange(files.filter((_, i) => i !== index));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
                {label}
            </label>

            {/* Upload Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${dragActive
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-foreground font-medium mb-1">
                        Drop files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Max size: {maxSize}MB {accept !== "*" && `• Accepted: ${accept}`}
                    </p>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <AnimatePresence>
                        {files.map((file, index) => (
                            <motion.div
                                key={`${file.name}-${index}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    {file.type.startsWith("image/") ? (
                                        <ImageIcon className="w-5 h-5 text-primary" />
                                    ) : (
                                        <File className="w-5 h-5 text-primary" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatSize(file.size)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
