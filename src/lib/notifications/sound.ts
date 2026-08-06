import { isSoundEnabled } from "./preferences";

let audioCtx: AudioContext | null = null;

export function playNotificationSound() {
  if (typeof window === "undefined" || !isSoundEnabled()) return;

  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    audioCtx ??= new Ctx();
    const ctx = audioCtx;

    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.42);
  } catch {
    /* ignore audio failures */
  }
}
