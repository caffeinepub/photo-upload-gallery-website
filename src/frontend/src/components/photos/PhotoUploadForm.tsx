import { useState, useRef, useCallback } from 'react';
import { useUploadPhoto } from '../../hooks/usePhotos';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PhotoUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadPhoto();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setUploadProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        onProgress: setUploadProgress,
      });

      // Clear form on success
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Error is handled by mutation
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    uploadMutation.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isUploading = uploadMutation.isPending;
  const isSuccess = uploadMutation.isSuccess;
  const isError = uploadMutation.isError;

  return (
    <Card className="overflow-hidden border-border/60 shadow-warm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Drop Zone */}
          {!selectedFile && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer hover:border-accent hover:bg-accent/5',
                isDragging ? 'border-accent bg-accent/10 shadow-warm' : 'border-border'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center shadow-warm">
                  <Upload className="w-8 h-8 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-base font-medium mb-1">
                    Drop your photo here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPEG, PNG, WebP, and GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedFile && previewUrl && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-muted/50 border border-border/40">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-contain"
                />
                {!isUploading && !isSuccess && (
                  <button
                    onClick={handleClear}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 hover:bg-background flex items-center justify-center transition-colors shadow-soft"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium truncate">{selectedFile.name}</span>
                <span className="text-muted-foreground">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>

              {/* Progress Bar */}
              {isUploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {!isSuccess && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1 shadow-warm"
                    size="lg"
                  >
                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                  {!isUploading && (
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      size="lg"
                      className="border-accent/30"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <Alert className="border-accent/40 bg-accent/10">
              <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
              <AlertDescription className="text-foreground">
                Photo uploaded successfully! It will appear in your gallery shortly.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {uploadMutation.error?.message || 'Failed to upload photo. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Another Button */}
          {isSuccess && (
            <Button onClick={handleClear} variant="outline" className="w-full border-accent/30" size="lg">
              Upload Another Photo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
