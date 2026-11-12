const messages = {
  ja: {
    title: "SarayBelly — 動画トリマー",
    language: "表示言語",
    localNote: "PC内で動画を処理",
    headline: "残したい瞬間を。<br><span>かんたん切り出し。</span>",
    intro: "PCから動画を選び、長さを指定してプレビュー。完成した動画をMP4で保存できます。",
    trimCard: "動画トリミングツール",
    upload: "PCから動画を選択",
    emptyName: "動画ファイルを選択してください",
    fileTypes: "MP4、MOV、MKV、WebM、AVI など",
    browse: "ファイルを選択",
    length: "切り出す長さ",
    seconds30: "30 秒",
    seconds60: "60 秒",
    custom: "自由に指定",
    start: "開始位置（秒）",
    customLength: "切り出す長さ（秒）",
    trim: "トリミングしてプレビュー",
    result: "切り出しプレビュー",
    ready: "MP4の準備ができました",
    save: "保存先を選んでMP4を保存",
    saveDefault: "保存先を選択してください。",
    footer: "動画処理はこのPC内で完結します。API利用料やサブスクリプションは不要です。",
    videoLength: "動画の長さ: {time}（{seconds} 秒）",
    unreadableMetadata: "動画の長さを読み取れませんでした。",
    invalidStart: "開始位置は0以上の数値で入力してください。",
    invalidDuration: "切り出す長さは0より大きい数値で入力してください。",
    rangeExceeds: "切り出し範囲が元の動画の長さを超えています。",
    processing: "トリミングしてMP4に変換しています...",
    previewReady: "MP4プレビューの準備完了 · {duration}秒",
    savePickerType: "MP4動画",
    saved: "選択した場所にMP4を保存しました。",
    fallbackSaved: "ダウンロードを開始しました。ブラウザーの保存先を確認してください。",
    saveCancelled: "保存をキャンセルしました。",
    saveFailed: "MP4を保存できませんでした。",
    trimFailed: "動画をトリミングできませんでした。",
    upload_required: "PCから動画ファイルを選択してください。",
    invalid_values: "開始位置と切り出す長さを正しく入力してください。",
    negative_start: "開始位置は0以上にしてください。",
    invalid_duration: "切り出す長さは1秒から60分の間で指定してください。",
    ffmpeg_missing: "FFmpegが必要です。インストールしてPATHに追加してください。",
    unreadable_video: "動画の長さを読み取れません。別の動画ファイルをお試しください。",
    start_after_end: "開始位置は動画の終了前にしてください。",
    range_exceeds_api: "選択した範囲が動画の長さを超えています。動画の長さ: {duration} 秒",
    too_large: "動画ファイルがアップロード上限の4 GBを超えています。",
    timeout: "動画の処理に時間がかかりすぎました。短い範囲をお試しください。",
    process_failed: "動画を処理できませんでした。別の動画ファイルをお試しください。",
    output_missing: "MP4ファイルを作成できませんでした。",
    request_failed: "動画を処理できませんでした。",
  },
  en: {
    title: "SarayBelly — Video Trimmer",
    language: "Language",
    localNote: "Video stays on this PC",
    headline: "Keep the moment.<br><span>Trim the rest.</span>",
    intro: "Choose a video from your PC, set the length, preview your clip, and save it as an MP4.",
    trimCard: "Video trimmer",
    upload: "CHOOSE A VIDEO FROM YOUR PC",
    emptyName: "Choose a video file",
    fileTypes: "MP4, MOV, MKV, WebM, AVI and more",
    browse: "Browse files",
    length: "CLIP LENGTH",
    seconds30: "30 seconds",
    seconds60: "60 seconds",
    custom: "Custom length",
    start: "START TIME (SECONDS)",
    customLength: "CUSTOM LENGTH (SECONDS)",
    trim: "Trim and create preview",
    result: "TRIMMED PREVIEW",
    ready: "Your MP4 is ready",
    save: "Choose save location & save MP4",
    saveDefault: "Choose where to save the finished video on your PC.",
    footer: "Video processing stays on this PC. No paid API or subscription required.",
    videoLength: "Video length: {time} ({seconds} seconds)",
    unreadableMetadata: "Could not read the video length.",
    invalidStart: "Enter a valid start time of zero or more seconds.",
    invalidDuration: "Enter a clip length greater than zero.",
    rangeExceeds: "The selected clip ends after the source video.",
    processing: "Trimming and converting to MP4...",
    previewReady: "MP4 preview ready · {duration} seconds",
    savePickerType: "MP4 video",
    saved: "MP4 saved to your selected location.",
    fallbackSaved: "Download started. Check your browser's download location.",
    saveCancelled: "Save cancelled.",
    saveFailed: "Could not save this MP4.",
    trimFailed: "Could not trim this video.",
    upload_required: "Choose a video file from your PC.",
    invalid_values: "Enter valid start time and clip length values.",
    negative_start: "Start time must be zero or greater.",
    invalid_duration: "Clip length must be between 1 second and 60 minutes.",
    ffmpeg_missing: "FFmpeg is required. Install it and add it to PATH.",
    unreadable_video: "Could not read the video length. Try another video file.",
    start_after_end: "Start time must be before the end of the video.",
    range_exceeds_api: "The selected clip exceeds the video length. Video length: {duration} seconds",
    too_large: "The video exceeds the 4 GB upload limit.",
    timeout: "Video processing took too long. Try a shorter clip.",
    process_failed: "Could not process this video. Try another video file.",
    output_missing: "Could not create the MP4 file.",
    request_failed: "Could not process this video.",
  },
};

const languageSelect = document.querySelector("#language-select");
const fileInput = document.querySelector("#video-file");
const fileName = document.querySelector("#file-name");
const fileHint = document.querySelector("#file-hint");
const sourcePreview = document.querySelector("#source-preview");
const videoInfo = document.querySelector("#video-info");
const clipLength = document.querySelector("#clip-length");
const startTime = document.querySelector("#start-time");
const customLengthWrap = document.querySelector("#custom-length-wrap");
const customSeconds = document.querySelector("#custom-seconds");
const trimButton = document.querySelector("#trim-button");
const statusMessage = document.querySelector("#status");
const result = document.querySelector("#result");
const resultPreview = document.querySelector("#result-preview");
const saveButton = document.querySelector("#save-button");
const saveHint = document.querySelector("#save-hint");

let language = localStorage.getItem("saraybelly-language") === "en" ? "en" : "ja";
let selectedFile = null;
let sourceUrl = null;
let resultUrl = null;
let resultBlob = null;
let currentStatus = null;
let currentSaveHint = { key: "saveDefault", params: {} };

function t(key, params = {}) {
  const template = messages[language][key] || messages.ja[key] || key;
  return template.replace(/\{(\w+)\}/g, (_match, name) => params[name] ?? "");
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function setStatus(key, params = {}, isError = false) {
  currentStatus = { key, params, isError };
  statusMessage.textContent = t(key, params);
  statusMessage.classList.toggle("error", isError);
}

function setBackendError(payload) {
  const params = payload.params || {};
  const key = payload.error_key === "range_exceeds" ? "range_exceeds_api" : payload.error_key;
  if (key && messages.ja[key]) {
    setStatus(key, params, true);
  } else {
    setStatus("request_failed", {}, true);
  }
}

function setSaveHint(key) {
  currentSaveHint = { key, params: {} };
  saveHint.textContent = t(key);
}

function updateTrimButton() {
  trimButton.disabled = !selectedFile || trimButton.dataset.processing === "true";
}

function clearResultPreview() {
  if (resultUrl) URL.revokeObjectURL(resultUrl);
  resultUrl = null;
  resultBlob = null;
  resultPreview.pause();
  resultPreview.removeAttribute("src");
  resultPreview.load();
}

function applyLanguage(nextLanguage) {
  language = nextLanguage === "en" ? "en" : "ja";
  localStorage.setItem("saraybelly-language", language);
  document.documentElement.lang = language;
  document.title = t("title");
  document.querySelector("#language-label").textContent = t("language");
  document.querySelector("#local-note").textContent = t("localNote");
  document.querySelector("#headline").innerHTML = t("headline");
  document.querySelector("#intro").textContent = t("intro");
  document.querySelector("#trim-card").setAttribute("aria-label", t("trimCard"));
  document.querySelector("#upload-label").textContent = t("upload");
  fileName.dataset.emptyLabel = t("emptyName");
  if (!selectedFile) fileName.textContent = t("emptyName");
  if (!selectedFile) fileHint.textContent = t("fileTypes");
  document.querySelector("#browse-label").textContent = t("browse");
  document.querySelector("#length-label").textContent = t("length");
  clipLength.options[0].textContent = t("seconds30");
  clipLength.options[1].textContent = t("seconds60");
  clipLength.options[2].textContent = t("custom");
  document.querySelector("#start-label").textContent = t("start");
  document.querySelector("#custom-length-label").textContent = t("customLength");
  document.querySelector("#trim-button-label").textContent = t("trim");
  document.querySelector("#result-label").textContent = t("result");
  document.querySelector("#result-ready").textContent = t("ready");
  document.querySelector("#save-button-label").textContent = t("save");
  document.querySelector("#footer-note").textContent = t("footer");
  if (Number.isFinite(sourcePreview.duration)) {
    videoInfo.textContent = t("videoLength", {
      time: formatTime(sourcePreview.duration),
      seconds: sourcePreview.duration.toFixed(1),
    });
  } else if (!videoInfo.classList.contains("hidden")) {
    videoInfo.textContent = t("unreadableMetadata");
  }
  if (currentStatus) {
    statusMessage.textContent = t(currentStatus.key, currentStatus.params);
    statusMessage.classList.toggle("error", currentStatus.isError);
  }
  saveHint.textContent = t(currentSaveHint.key, currentSaveHint.params);
}

languageSelect.value = language;
applyLanguage(language);
languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));

function chosenDuration() {
  return clipLength.value === "custom"
    ? Number(customSeconds.value)
    : Number(clipLength.value);
}

fileInput.addEventListener("change", () => {
  selectedFile = fileInput.files[0] || null;
  clearResultPreview();
  result.classList.add("hidden");
  currentStatus = null;
  statusMessage.classList.remove("error");
  statusMessage.textContent = "";
  fileName.textContent = selectedFile?.name || t("emptyName");
  fileHint.textContent = selectedFile
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
    : t("fileTypes");

  if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  sourceUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;
  sourcePreview.classList.toggle("hidden", !selectedFile);
  videoInfo.classList.add("hidden");
  if (sourceUrl) {
    sourcePreview.src = sourceUrl;
    sourcePreview.load();
  } else {
    sourcePreview.removeAttribute("src");
    sourcePreview.load();
  }
  updateTrimButton();
});

sourcePreview.addEventListener("loadedmetadata", () => {
  const duration = sourcePreview.duration;
  if (!Number.isFinite(duration)) {
    videoInfo.textContent = t("unreadableMetadata");
    videoInfo.classList.remove("hidden");
    return;
  }

  videoInfo.textContent = t("videoLength", {
    time: formatTime(duration),
    seconds: duration.toFixed(1),
  });
  videoInfo.classList.remove("hidden");
  for (const option of clipLength.options) {
    if (option.value !== "custom") {
      option.disabled = Number(option.value) > duration;
    }
  }
  if (clipLength.selectedOptions[0].disabled) {
    clipLength.value = "custom";
    customSeconds.value = Math.max(1, Math.floor(duration)).toString();
    customLengthWrap.classList.remove("hidden");
  }
});

clipLength.addEventListener("change", () => {
  customLengthWrap.classList.toggle("hidden", clipLength.value !== "custom");
});

trimButton.addEventListener("click", async () => {
  if (!selectedFile) return;

  const start = Number(startTime.value);
  const duration = chosenDuration();
  if (!Number.isFinite(start) || start < 0) {
    setStatus("invalidStart", {}, true);
    return;
  }
  if (!Number.isFinite(duration) || duration <= 0) {
    setStatus("invalidDuration", {}, true);
    return;
  }
  if (start + duration > sourcePreview.duration + 0.05) {
    setStatus("rangeExceeds", {}, true);
    return;
  }

  const formData = new FormData();
  formData.append("video", selectedFile);
  formData.append("start", String(start));
  formData.append("duration", String(duration));
  formData.append("language", language);
  trimButton.dataset.processing = "true";
  trimButton.disabled = true;
  setStatus("processing");
  clearResultPreview();
  result.classList.add("hidden");
  setSaveHint("saveDefault");
  fileInput.disabled = true;

  try {
    const response = await fetch(`/trim?lang=${language}`, { method: "POST", body: formData });
    if (!response.ok) {
      setBackendError(await response.json());
      return;
    }

    const blob = await response.blob();
    resultBlob = blob;
    resultUrl = URL.createObjectURL(blob);
    resultPreview.src = resultUrl;
    resultPreview.load();
    result.classList.remove("hidden");
    setStatus("previewReady", { duration });
  } catch (_error) {
    setStatus("request_failed", {}, true);
  } finally {
    fileInput.disabled = false;
    trimButton.dataset.processing = "false";
    updateTrimButton();
  }
});

saveButton.addEventListener("click", async () => {
  if (!resultUrl || !selectedFile) return;

  const baseName = selectedFile.name.replace(/\.[^.]+$/, "") || "video";
  const filename = `${baseName}-trimmed.mp4`;
  saveButton.disabled = true;
  try {
    if (typeof window.showSaveFilePicker === "function") {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: t("savePickerType"), accept: { "video/mp4": [".mp4"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(resultBlob);
      await writable.close();
      setSaveHint("saved");
      return;
    }

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setSaveHint("fallbackSaved");
  } catch (error) {
    if (error.name === "AbortError") {
      setSaveHint("saveCancelled");
    } else {
      setStatus("saveFailed", {}, true);
    }
  } finally {
    saveButton.disabled = false;
  }
});
