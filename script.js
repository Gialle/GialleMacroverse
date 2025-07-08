const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const activeNotes = {};
const keyBindings = [];
const keyMap = "1234567890qwertyuiopasdfghjklzxcvbnm,.;/";

const select = document.getElementById("scaleSelect");
const container = document.getElementById("scaleContainer");

function midiToHz(midi) {
  return 440 * Math.pow(2, (midi-69)/12);
}
function getBaseFreq() {
  const type = document.getElementById("baseType").value;
  const val = parseFloat(document.getElementById("baseValue").value);
  return (type==="hz") ? val : midiToHz(val);
}

function startNote(key, cents) {
  if (activeNotes[key]) return;
  const offset = parseFloat(document.getElementById("offsetCents").value) || 0;
  const baseFreq = getBaseFreq();
  const freq = baseFreq * Math.pow(2, (cents+offset)/1200);
  const oscType = document.getElementById("oscType").value;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = oscType;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  activeNotes[key] = {osc, gain};
}

function stopNote(key) {
  if (!activeNotes[key]) return;
  const { osc, gain } = activeNotes[key];
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
  osc.stop(audioCtx.currentTime + 1);
  delete activeNotes[key];
}

function buildScaleUI(notes, scaleName) {
  container.innerHTML = "";
  keyBindings.length = 0;
  let idx = 0;
  for (let o=0; o<5; o++) {
    notes.forEach((note, i) => {
      const cents = note.cents + (1200*o);
      const keyId = scaleName+o+i;
      const keyChar = keyMap[idx++] || "";
      const a = document.createElement('a');
      const colors = ["ruby","orng","emra","turq","amet","gold","moss","aqua"];
      a.className = colors[i % colors.length];
      a.innerHTML = `${note.name}<br>[${keyChar}]<br>${cents}¢`;
      a.onmousedown=()=>startNote(keyId,cents);
      a.onmouseup=a.onmouseleave=()=>stopNote(keyId);
      a.ontouchstart=(e)=>{e.preventDefault();startNote(keyId,cents);};
      a.ontouchend=()=>stopNote(keyId);
      container.appendChild(a);
      keyBindings.push({key:keyChar, id:keyId, cents});
    });
    container.appendChild(document.createElement('br'));
  }
}

// load JSON
fetch('scale.json')
  .then(res => res.json())
  .then(data => {
    data.scales.forEach(scale => {
      const opt = document.createElement("option");
      opt.value = scale.name;
      opt.innerText = scale.name;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => {
      const scale = data.scales.find(s => s.name === select.value);
      buildScaleUI(scale.notes, scale.name);
    });
    // render pertama
    const firstScale = data.scales[0];
    select.value = firstScale.name;
    buildScaleUI(firstScale.notes, firstScale.name);
  })
  .catch(err => {
    container.innerHTML = `<p style="color:red">Gagal load scale.json: ${err}</p>`;
  });

// keyboard support
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const b = keyBindings.find(b => b.key === e.key);
  if (b) startNote(b.id, b.cents);
});
document.addEventListener('keyup', (e) => {
  const b = keyBindings.find(b => b.key === e.key);
  if (b) stopNote(b.id);
});
