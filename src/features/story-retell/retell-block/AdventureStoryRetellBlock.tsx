import { useEffect, useMemo, useRef, useState } from 'react';
import { otterCharacterImage } from '../../../assets/characters/otter';
import { ActionButton } from '../../../components/ui/ActionButton';
import { GlowButton } from '../../../components/ui/GlowButton';
import { useProductSession } from '../../../state';
import { forestGeneratedSceneAssets } from '../../forest/assets';
import { forestExplorationFirstPersonBackgroundImage } from '../../forest/assets/backgrounds';

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{
    0: {
      transcript: string;
    };
    isFinal: boolean;
  }>;
};

type AlbumEntry = {
  id: string;
  childName: string;
  companionName: string;
  createdAt: string;
  transcript: string;
  audioDataUrl: string;
  images: string[];
};

const ALBUM_STORAGE_KEY = 'otter-planet:adventure-album';

const albumImages = [
  forestExplorationFirstPersonBackgroundImage,
  forestGeneratedSceneAssets.forestMoonlitRoadCurveB,
  forestGeneratedSceneAssets.forestMoonVineRoad,
];

const retellPrompts = [
  '先讲讲你和小水獭为什么出发。',
  '再说说路上遇见了哪几位伙伴。',
  '最后讲讲你看到的光、树、浮石和月亮。',
];

function readAlbumEntries(): AlbumEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(ALBUM_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) as AlbumEntry[] : [];
  } catch {
    return [];
  }
}

function writeAlbumEntries(entries: AlbumEntry[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ALBUM_STORAGE_KEY, JSON.stringify(entries));
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function createSpeechRecognition() {
  if (typeof window === 'undefined') {
    return null;
  }

  const SpeechRecognitionConstructor =
    (window as Window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    }).SpeechRecognition ??
    (window as Window & {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    }).webkitSpeechRecognition;

  return SpeechRecognitionConstructor ? new SpeechRecognitionConstructor() : null;
}

export function AdventureStoryRetellBlock() {
  const { session, patchSession } = useProductSession();
  const companionName = session.otterName || '小水獭';
  const childName = session.childName || '小朋友';
  const defaultDraft = `我和${companionName}一起跑进月光森林，路边的树和发光的小路一直向后退。我们遇见了闪闪、小贝壳和猕猴桃先生，他们给了我们新的线索，也让我们更想继续往前探索。`;
  const [retellDraft, setRetellDraft] = useState(session.retellDraft || defaultDraft);
  const [albumEntries, setAlbumEntries] = useState<AlbumEntry[]>(() => readAlbumEntries());
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('准备好后，点击开始录音。');
  const [audioDataUrl, setAudioDataUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const latestEntry = albumEntries[0];
  const canSave = retellDraft.trim().length > 0;

  const albumStats = useMemo(
    () => ({
      storyCount: albumEntries.length,
      imageCount: albumEntries.reduce((total, entry) => total + entry.images.length, 0),
    }),
    [albumEntries],
  );

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      speechRecognitionRef.current?.stop();
    };
  }, []);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordingStatus('当前浏览器不支持录音，可以直接在文字区记录孩子讲述。');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const speechRecognition = createSpeechRecognition();

      chunksRef.current = [];
      setAudioDataUrl('');
      setSaved(false);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        const dataUrl = await blobToDataUrl(audioBlob);
        setAudioDataUrl(dataUrl);
        setIsRecording(false);
        setRecordingStatus('录音已完成，转写文字可以继续编辑。');
        stream.getTracks().forEach((track) => track.stop());
      };

      if (speechRecognition) {
        speechRecognition.continuous = true;
        speechRecognition.interimResults = true;
        speechRecognition.lang = 'zh-CN';
        speechRecognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0]?.transcript ?? '')
            .join('');

          if (transcript.trim()) {
            setRetellDraft(transcript);
          }
        };
        speechRecognition.onend = () => {
          speechRecognitionRef.current = null;
        };
        speechRecognition.start();
        speechRecognitionRef.current = speechRecognition;
      }

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingStatus(speechRecognition ? '正在录音并实时转写。' : '正在录音。当前浏览器不支持实时转写，稍后可手动整理文字。');
    } catch {
      setRecordingStatus('没有拿到麦克风权限，可以检查浏览器权限后再试。');
    }
  };

  const stopRecording = () => {
    speechRecognitionRef.current?.stop();
    speechRecognitionRef.current = null;
    mediaRecorderRef.current?.stop();
    setRecordingStatus('正在整理录音。');
  };

  const saveToAlbum = () => {
    if (!canSave) {
      return;
    }

    const nextEntry: AlbumEntry = {
      id: `${Date.now()}`,
      childName,
      companionName,
      createdAt: new Date().toLocaleString('zh-CN'),
      transcript: retellDraft.trim(),
      audioDataUrl,
      images: albumImages,
    };
    const nextEntries = [nextEntry, ...albumEntries];

    setAlbumEntries(nextEntries);
    writeAlbumEntries(nextEntries);
    patchSession({ retellDraft });
    setSaved(true);
  };

  return (
    <section className="story-retell-block">
      <img
        className="story-retell-block__background"
        src={forestExplorationFirstPersonBackgroundImage}
        alt=""
        aria-hidden="true"
      />
      <div className="story-retell-block__veil" />

      <div className="story-retell-block__header">
        <p>故事回顾</p>
        <h1>{childName} 的冒险旅程相册</h1>
        <span>让孩子讲述刚才的探索。录音会转成文字，并和三张冒险配图一起存进相册。</span>
      </div>

      <div className="story-retell-block__body story-retell-block__body--album">
        <section className="story-retell-recorder">
          <div className="story-retell-recorder__head">
            <div>
              <p>讲述录音</p>
              <h2>说出整段冒险</h2>
            </div>
            <img src={otterCharacterImage} alt={`${companionName}陪你回顾故事`} />
          </div>

          <div className="story-retell-recorder__prompts">
            {retellPrompts.map((prompt) => (
              <span key={prompt}>{prompt}</span>
            ))}
          </div>

          <div className="story-retell-recorder__controls">
            <ActionButton variant="primary" onClick={isRecording ? stopRecording : startRecording}>
              {isRecording ? '结束录音' : '开始录音'}
            </ActionButton>
            <span>{recordingStatus}</span>
          </div>

          {audioDataUrl ? (
            <audio className="story-retell-recorder__audio" src={audioDataUrl} controls />
          ) : null}

          <label className="story-retell-editor__field">
            <span>录音转文字结果</span>
            <textarea
              value={retellDraft}
              onChange={(event) => {
                setRetellDraft(event.target.value);
                setSaved(false);
              }}
              placeholder="孩子讲述后，这里会出现转写文字，也可以手动补充。"
            />
          </label>

          <div className="story-retell-editor__actions">
            <ActionButton variant="primary" onClick={saveToAlbum} disabled={!canSave}>
              存入冒险相册
            </ActionButton>
            <GlowButton to="/video-result" tone="gold">
              进入月亮结果
            </GlowButton>
            {saved ? <span>已保存到冒险旅程相册。</span> : null}
          </div>
        </section>

        <section className="adventure-album">
          <div className="adventure-album__head">
            <div>
              <p>冒险旅程相册</p>
              <h2>所有讲过的故事</h2>
            </div>
            <span>{albumStats.storyCount} 个故事 / {albumStats.imageCount} 张图片</span>
          </div>

          {latestEntry ? (
            <article className="adventure-album__featured">
              <div>
                <p>{latestEntry.createdAt}</p>
                <h3>{latestEntry.childName} 和 {latestEntry.companionName}</h3>
                <span>{latestEntry.transcript}</span>
              </div>
              {latestEntry.audioDataUrl ? <audio src={latestEntry.audioDataUrl} controls /> : null}
              <div className="adventure-album__image-grid">
                {latestEntry.images.map((image, index) => (
                  <img key={`${latestEntry.id}-${image}`} src={image} alt={`冒险配图 ${index + 1}`} />
                ))}
              </div>
            </article>
          ) : (
            <div className="adventure-album__empty">
              <h3>还没有保存故事</h3>
              <span>完成一次录音或整理好文字后，就可以生成第一本冒险旅程相册。</span>
            </div>
          )}

          <div className="adventure-album__list">
            {albumEntries.map((entry) => (
              <article key={entry.id}>
                <p>{entry.createdAt}</p>
                <h3>{entry.transcript.slice(0, 32)}{entry.transcript.length > 32 ? '...' : ''}</h3>
                <span>{entry.images.length} 张配图</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
