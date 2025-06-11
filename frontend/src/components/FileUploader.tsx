import { Input } from "@/components/ui/input";

interface Props {
  setFile: (file: File) => void;
}

const FileUploader = ({ setFile }: Props) => {
  return (
    <Input
      type="file"
      className="w-64 rounded-md cursor-pointer bg-transparent text-white hover:bg-primary hover:text-white file:text-white file:bg-transparent file:border-0 file:mr-2 hover:scale-105 transtion-all duration-300"
      onChange={(e) => e.target.files && setFile(e.target.files[0])}
    />
  );
};

export default FileUploader;
