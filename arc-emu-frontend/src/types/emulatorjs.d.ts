export {};

declare global {
  interface Window {
    // Required
    EJS_pathtodata: string;
    EJS_gameUrl: string;
    EJS_core: string;
    EJS_player: string;
    EJS_gameName: string;
    EJS_startOnLoaded: boolean;

    EJS_disableAutoLang?: boolean;
    EJS_language?: string;
    EJS_cheats?: any[];
    EJS_GameID?: string;
    EJS_backgroundImage?: string;
    EJS_backgroundColor?: string;
    EJS_threads?: boolean;
    EJS_disableCheat?: boolean;
    EJS_onGameStart?: () => void;
    EJS_onError?: (error: any) => void;
    EJS_onLoadGame?: () => void;
    EJS_emulator?: {
      start: () => void;
      pause: () => void;
      resume: () => void;
      stop: () => void;
    };
  }
}
