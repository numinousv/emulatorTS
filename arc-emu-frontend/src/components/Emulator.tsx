import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { X } from "lucide-react";
import { getCachedRom, cacheRom } from "@/lib/rom-cache";

interface EmulatorProps {
  romUrl: string;
  core: string;
  gameName: string;
  gameId: string;
}

export function Emulator({ romUrl, core, gameName, gameId }: EmulatorProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const objectUrlRef = useRef<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, []);

  function cleanup() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
  }

  const dismissOverlay = () => setShowOverlay(false);

  // Allow keyboard users to dismiss the loading overlay with Escape
  useEffect(() => {
    if (!showOverlay || status === "idle") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismissOverlay();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showOverlay, status]);

  const startGame = async () => {
    try {
      setStatus("loading");
      setShowOverlay(true);

      const resolvedRomUrl = romUrl.startsWith("/api/archive")
        ? romUrl.replace("/api/archive", "https://archive.org")
        : romUrl;

      const cachedBlob = await getCachedRom(gameId);

      let blob: Blob;

      if (cachedBlob) {
        blob = cachedBlob;
      } else {
        const response = await axios.get<ArrayBuffer>(resolvedRomUrl, {
          responseType: "arraybuffer",
          onDownloadProgress: (e) => {
            if (e.total) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          },
        });

        const arrayBuffer = response.data;
        const firstBytes = new Uint8Array(arrayBuffer.slice(0, 20));
        const text = new TextDecoder().decode(firstBytes);

        if (text.trim().startsWith("<")) {
          throw new Error("Proxy returned HTML error page instead of ROM");
        }

        blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
        cacheRom(gameId, blob);
      }

      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;

      window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
      window.EJS_gameUrl = objectUrl;
      window.EJS_core = core;
      window.EJS_player = "#game";
      window.EJS_gameName = gameName;
      window.EJS_startOnLoaded = true;
      window.EJS_disableAutoLang = true;
      window.EJS_language = "en-US";
      window.EJS_cheats = [];
      window.EJS_threads = true;

      const script = document.createElement("script");
      script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
      script.async = true;
      scriptRef.current = script;

      script.onerror = () => {
        if (mountedRef.current) {
          setStatus("error");
          setErrorMsg("Failed to load emulator script");
        }
      };

      document.body.appendChild(script);

      // Auto-dismiss overlay after 10s regardless
      setTimeout(() => {
        if (mountedRef.current) {
          setShowOverlay(false);
          setStatus("ready");
        }
      }, 10000);
    } catch (err) {
      if (mountedRef.current) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      }
    }
  };

  if (status === "error") {
    return (
      <div className="text-red-600 p-5">
        <p>Error: {errorMsg}</p>
        <Button
          onClick={() => setStatus("idle")}
          variant="destructive"
          size="sm"
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <Button
        onClick={startGame}
        variant="outline"
        size="lg"
        className="px-6 py-4 text-sm sm:px-10 sm:py-5 sm:text-xs items-center text-muted-foreground mx-auto border-none rounded-lg cursor-pointer retro"
      >
        ▶ Play {gameName}
      </Button>
    );
  }

  return (
    <div className="relative">
      <div
        id="game"
        className="w-full aspect-video min-h-[300px] bg-black"
      />
      {showOverlay && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <button
            onClick={dismissOverlay}
            className="absolute top-2 right-2 min-h-11 min-w-11 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors inline-flex items-center justify-center"
            aria-label="Dismiss loading overlay"
            type="button"
          >
            <X className="size-5" />
          </button>
          <Spinner />
          <p
            className="text-white text-center mt-4 px-4"
            role="status"
            aria-live="polite"
          >
            {progress > 0
              ? `Downloading ROM... ${progress}%`
              : "Loading game..."}
          </p>
          {progress > 0 && (
            <div
              className="w-3/4 max-w-xs bg-white/20 rounded-full h-2 mt-3 overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="ROM download progress"
            >
              <div
                className="bg-white h-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <p className="text-gray-400 text-xs mt-2 px-4 text-center">
            Press Escape or the × button to dismiss
          </p>
        </div>
      )}
    </div>
  );
}
