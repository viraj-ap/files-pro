import subprocess

def convert_file(input_path, output_path):
    subprocess.run(["ffmpeg", "-y", "-i", input_path, output_path], check=True)

def compress_video(input_path, output_path):
    subprocess.run(["ffmpeg", "-y", "-i", input_path, "-vcodec", "libx264", "-crf", "28", output_path], check=True)

def compress_image(input_path, output_path):
    subprocess.run(["ffmpeg", "-y", "-i", input_path, "-qscale:v", "5", output_path], check=True)
