interface Props {
  setTarget: (format: string) => void;
}

const formats = ["mp4", "mp3", "avi", "mkv", "webm", "jpg", "png", "gif"];

const FormatSelector = ({ setTarget }: Props) => {
  return (
    <select
      onChange={(e) => setTarget(e.target.value)}
      className="bg-gray-800 p-2 rounded"
    >
      <option value="">Select Format</option>
      {formats.map((fmt) => (
        <option key={fmt} value={fmt}>
          {fmt.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default FormatSelector;
