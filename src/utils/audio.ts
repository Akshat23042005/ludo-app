export function playSound(type: 'roll' | 'move' | 'capture' | 'win', level: 'off' | 'low' | 'medium' | 'high') {
  if (level === 'off') return
  
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    const vol = level === 'low' ? 0.05 : level === 'medium' ? 0.1 : 0.2
    gain.gain.value = vol
    
    if (type === 'roll') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(400, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } else if (type === 'move') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(300, ctx.currentTime)
      osc.start()
      osc.stop(ctx.currentTime + 0.05)
    } else if (type === 'capture') {
      osc.type = 'square'
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2)
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    } else if (type === 'win') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(400, ctx.currentTime)
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.2)
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.4)
      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    }
  } catch (e) {
    console.error('Audio failed', e)
  }
}
