import io
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import app


class VideoTrimmerTests(unittest.TestCase):
    def setUp(self) -> None:
        app.app.config.update(TESTING=True)
        self.client = app.app.test_client()

    def test_homepage_has_upload_and_trim_controls(self) -> None:
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        for text in ("video-file", "30 秒", "60 秒", "自由に指定", "English"):
            self.assertIn(text.encode(), response.data)

    def test_requires_an_uploaded_file(self) -> None:
        response = self.client.post(
            "/trim",
            data={"start": "0", "duration": "30"},
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("動画ファイルを選択", response.get_json()["error"])

    def test_api_errors_follow_selected_language(self) -> None:
        response = self.client.post(
            "/trim?lang=en",
            data={"start": "0", "duration": "30"},
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "Choose a video file from your PC.")
        self.assertEqual(response.get_json()["error_key"], "upload_required")

    def test_rejects_invalid_clip_lengths(self) -> None:
        for duration in ("0", "nan", "3601"):
            with self.subTest(duration=duration):
                response = self.client.post(
                    "/trim",
                    data={
                        "video": (io.BytesIO(b"video"), "clip.mp4"),
                        "start": "0",
                        "duration": duration,
                    },
                    content_type="multipart/form-data",
                )
                self.assertEqual(response.status_code, 400)

    def test_rejects_non_finite_start_time(self) -> None:
        response = self.client.post(
            "/trim",
            data={
                "video": (io.BytesIO(b"video"), "clip.mp4"),
                "start": "nan",
                "duration": "30",
            },
            content_type="multipart/form-data",
        )
        self.assertEqual(response.status_code, 400)

    def test_returns_trimmed_mp4(self) -> None:
        temporary_directory = tempfile.TemporaryDirectory()
        self.addCleanup(temporary_directory.cleanup)

        def fake_trim(_source, output, _start, _duration, _ffmpeg):
            output.write_bytes(b"mp4-data")

        with (
            patch.object(app.tempfile, "TemporaryDirectory", return_value=temporary_directory),
            patch.object(app.shutil, "which", return_value="ffmpeg"),
            patch.object(app, "get_video_duration", return_value=90),
            patch.object(app, "trim_video", side_effect=fake_trim),
        ):
            response = self.client.post(
                "/trim",
                data={
                    "video": (io.BytesIO(b"source-video"), "clip.mp4"),
                    "start": "10",
                    "duration": "30",
                },
                content_type="multipart/form-data",
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, "video/mp4")
        self.assertIn("SarayBelly-trim.mp4", response.headers["Content-Disposition"])
        response.close()

    def test_rejects_clip_that_exceeds_video_length(self) -> None:
        with patch.object(app.shutil, "which", return_value="ffmpeg"):
            with patch.object(app, "get_video_duration", return_value=40):
                response = self.client.post(
                    "/trim",
                    data={
                        "video": (io.BytesIO(b"source-video"), "clip.mp4"),
                        "start": "20",
                        "duration": "30",
                    },
                    content_type="multipart/form-data",
                )
        self.assertEqual(response.status_code, 400)
        self.assertIn("超えています", response.get_json()["error"])


if __name__ == "__main__":
    unittest.main()
