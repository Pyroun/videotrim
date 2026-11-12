from __future__ import annotations

import re
import shutil
import subprocess
import tempfile
from math import isfinite
from pathlib import Path
from typing import BinaryIO

from flask import Flask, Response, jsonify, render_template, request, stream_with_context


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 4 * 1024**3
MAX_CLIP_SECONDS = 3600
DURATION_PATTERN = re.compile(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)")
ERROR_MESSAGES = {
    "ja": {
        "upload_required": "PCから動画ファイルを選択してください。",
        "invalid_values": "開始位置と切り出す長さを正しく入力してください。",
        "negative_start": "開始位置は0以上にしてください。",
        "invalid_duration": "切り出す長さは1秒から60分の間で指定してください。",
        "ffmpeg_missing": "FFmpegが必要です。インストールしてPATHに追加してください。",
        "unreadable_video": "動画の長さを読み取れません。別の動画ファイルをお試しください。",
        "start_after_end": "開始位置は動画の終了前にしてください。",
        "range_exceeds": "選択した範囲が動画の長さを超えています。動画の長さ: {duration} 秒",
        "too_large": "動画ファイルがアップロード上限の4 GBを超えています。",
        "timeout": "動画の処理に時間がかかりすぎました。短い範囲をお試しください。",
        "process_failed": "動画を処理できませんでした。別の動画ファイルをお試しください。",
        "output_missing": "MP4ファイルを作成できませんでした。",
    },
    "en": {
        "upload_required": "Choose a video file from your PC.",
        "invalid_values": "Enter valid start time and clip length values.",
        "negative_start": "Start time must be zero or greater.",
        "invalid_duration": "Clip length must be between 1 second and 60 minutes.",
        "ffmpeg_missing": "FFmpeg is required. Install it and add it to PATH.",
        "unreadable_video": "Could not read the video length. Try another video file.",
        "start_after_end": "Start time must be before the end of the video.",
        "range_exceeds": "The selected clip exceeds the video length. Video length: {duration} seconds",
        "too_large": "The video exceeds the 4 GB upload limit.",
        "timeout": "Video processing took too long. Try a shorter clip.",
        "process_failed": "Could not process this video. Try another video file.",
        "output_missing": "Could not create the MP4 file.",
    },
}


def error_response(key: str, language: str, status: int, **params):
    language = "en" if language == "en" else "ja"
    message = ERROR_MESSAGES[language][key].format(**params)
    return jsonify(error=message, error_key=key, params=params), status


def get_video_duration(path: Path, ffmpeg: str) -> float:
    result = subprocess.run(
        [ffmpeg, "-hide_banner", "-i", str(path)],
        capture_output=True,
        text=True,
        timeout=60,
        check=False,
    )
    match = DURATION_PATTERN.search(result.stderr)
    if not match:
        raise ValueError(ERROR_MESSAGES["ja"]["unreadable_video"])
    hours, minutes, seconds = match.groups()
    return int(hours) * 3600 + int(minutes) * 60 + float(seconds)


def trim_video(
    source: Path,
    output: Path,
    start_seconds: float,
    duration_seconds: float,
    ffmpeg: str,
) -> None:
    subprocess.run(
        [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-ss",
            str(start_seconds),
            "-i",
            str(source),
            "-t",
            str(duration_seconds),
            "-map",
            "0:v:0",
            "-map",
            "0:a?",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "23",
            "-c:a",
            "aac",
            "-movflags",
            "+faststart",
            "-f",
            "mp4",
            str(output),
        ],
        capture_output=True,
        text=True,
        timeout=1800,
        check=True,
    )


def stream_file(file: BinaryIO, temporary_directory: tempfile.TemporaryDirectory[str]):
    try:
        while chunk := file.read(64 * 1024):
            yield chunk
    finally:
        file.close()
        temporary_directory.cleanup()


@app.get("/")
def home():
    return render_template("index.html")


@app.errorhandler(413)
def request_too_large(_error):
    language = request.args.get("lang", "ja")
    return error_response("too_large", language, 413)


@app.post("/trim")
def trim():
    language = request.form.get("language", request.args.get("lang", "ja"))
    uploaded_file = request.files.get("video")
    if uploaded_file is None or not uploaded_file.filename:
        return error_response("upload_required", language, 400)

    try:
        start_seconds = float(request.form.get("start", "0"))
        duration_seconds = float(request.form.get("duration", "0"))
    except ValueError:
        return error_response("invalid_values", language, 400)

    if not isfinite(start_seconds) or start_seconds < 0:
        return error_response("negative_start", language, 400)
    if not isfinite(duration_seconds) or not 0 < duration_seconds <= MAX_CLIP_SECONDS:
        return error_response("invalid_duration", language, 400)

    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg is None:
        return error_response("ffmpeg_missing", language, 503)

    temporary_directory = tempfile.TemporaryDirectory(prefix="saraybelly-trim-")
    work_folder = Path(temporary_directory.name)
    source = work_folder / "source-video"
    output = work_folder / "trimmed-video.mp4"
    try:
        uploaded_file.save(source)
        video_duration = get_video_duration(source, ffmpeg)
        if start_seconds >= video_duration:
            temporary_directory.cleanup()
            return error_response("start_after_end", language, 400)
        if start_seconds + duration_seconds > video_duration + 0.05:
            temporary_directory.cleanup()
            return error_response(
                "range_exceeds", language, 400, duration=f"{video_duration:.2f}"
            )

        trim_video(source, output, start_seconds, duration_seconds, ffmpeg)
        if not output.is_file() or output.stat().st_size == 0:
            raise RuntimeError(ERROR_MESSAGES["ja"]["output_missing"])

        video_file = output.open("rb")
        response = Response(
            stream_with_context(stream_file(video_file, temporary_directory)),
            mimetype="video/mp4",
            headers={"Content-Disposition": 'attachment; filename="SarayBelly-trim.mp4"'},
        )
        response.call_on_close(temporary_directory.cleanup)
        return response
    except subprocess.TimeoutExpired:
        temporary_directory.cleanup()
        return error_response("timeout", language, 504)
    except subprocess.CalledProcessError as error:
        temporary_directory.cleanup()
        details = error.stderr.strip() if error.stderr else "詳細不明のFFmpegエラー"
        app.logger.error("FFmpeg failed to trim video: %s", details)
        return error_response("process_failed", language, 422)
    except (OSError, ValueError, RuntimeError) as error:
        temporary_directory.cleanup()
        app.logger.warning("Video trim failed: %s", error)
        if str(error) == ERROR_MESSAGES["ja"]["unreadable_video"]:
            return error_response("unreadable_video", language, 422)
        if str(error) == ERROR_MESSAGES["ja"]["output_missing"]:
            return error_response("output_missing", language, 422)
        return error_response("process_failed", language, 422)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
