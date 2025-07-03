import { useState, type JSX } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, FileText, CheckCircle } from "lucide-react";

// Types
interface FileUploaderProps {
  setFile: (file: File | null) => void;
}

interface FormatOption {
  value: string;
  label: string;
  category: string;
}

interface OperationOption {
  value: string;
  label: string;
  description: string;
}

type ToastType = 'success' | 'error' | 'warning';

// Simple toast implementation since sonner might not be available
const showToast = (type: ToastType, title: string, description: string): void => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-600' : 
    type === 'error' ? 'bg-red-600' : 'bg-yellow-600'
  } text-white`;
  
  toast.innerHTML = `
    <div class="flex items-start gap-2">
      <div class="mt-0.5">
        ${type === 'success' ? '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' :
          type === 'error' ? '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>' :
          '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>'
        }
      </div>
      <div>
        <div class="font-medium">${title}</div>
        <div class="text-sm opacity-90">${description}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.style.transform = 'translateX(0)', 10);
  
  // Remove after 4 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// FileUploader component
const FileUploader: React.FC<FileUploaderProps> = ({ setFile }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFiles = (files: FileList | null): void => {
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full">
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <label
        htmlFor="fileInput"
        className={`
          flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-300 hover:scale-[1.02]
          ${dragActive 
            ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' 
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-800 text-gray-400'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className={`w-8 h-8 mb-2 ${dragActive ? 'text-cyan-400' : 'text-gray-500'}`} />
        <p className="text-sm font-medium">
          {dragActive ? 'Drop your file here' : 'Click or drag file to upload'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Video, audio, and image files supported
        </p>
      </label>
    </div>
  );
};

function App(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<string>("");
  const [operation, setOperation] = useState<string>("convert");
  const [loading, setLoading] = useState<boolean>(false);

  const handleConvert = async (): Promise<void> => {
    if (!file || !target) {
      showToast("warning", "Missing file or format", "Please select both a file and a format.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", target);
    formData.append("operation", operation);

    try {
      const res = await fetch("http://localhost:5000/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Conversion failed.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.split(".")[0] + "_converted." + target;
      a.click();

      showToast("success", "File converted!", `Downloaded as .${target}`);
    } catch (err) {
      showToast("error", "Conversion failed", "Something went wrong while converting the file.");
    } finally {
      setLoading(false);
    }
  };

  const formatOptions: FormatOption[] = [
    { value: "mp4", label: "MP4", category: "video" },
    { value: "mp3", label: "MP3", category: "audio" },
    { value: "avi", label: "AVI", category: "video" },
    { value: "mkv", label: "MKV", category: "video" },
    { value: "webm", label: "WEBM", category: "video" },
    { value: "jpg", label: "JPG", category: "image" },
    { value: "png", label: "PNG", category: "image" },
    { value: "gif", label: "GIF", category: "image" },
  ];

  const operationOptions: OperationOption[] = [
    { value: "compress_video", label: "Compress Video", description: "Reduce video file size" },
    { value: "compress_image", label: "Compress Image", description: "Reduce image file size" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col items-center justify-center px-4 py-10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Files Pro
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">
              Convert, compress, and transform your files
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <FileUploader setFile={setFile} />
            
            {file && (
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <FileText className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Format
                </label>
                <Select onValueChange={(value: string) => setTarget(value)}>
                  <SelectTrigger className="w-full bg-gray-800/70 border-gray-700 text-white hover:bg-gray-800">
                    <SelectValue placeholder="Choose format" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {formatOptions.map((fmt: FormatOption) => (
                      <SelectItem 
                        key={fmt.value} 
                        value={fmt.value} 
                        className="text-white hover:bg-gray-800 focus:bg-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{fmt.label}</span>
                          <span className="text-xs text-gray-400 capitalize">
                            {fmt.category}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Operation
                </label>
                <Select onValueChange={(value: string) => setOperation(value)} defaultValue="convert">
                  <SelectTrigger className="w-full bg-gray-800/70 border-gray-700 text-white hover:bg-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {operationOptions.map((op: OperationOption) => (
                      <SelectItem 
                        key={op.value} 
                        value={op.value}
                        className="text-white hover:bg-gray-800 focus:bg-gray-800"
                      >
                        <div>
                          <div className="font-medium">{op.label}</div>
                          <div className="text-xs text-gray-400">{op.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleConvert}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 transition-all duration-300 hover:scale-[1.02] disabled:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Start Conversion
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;