const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const activeNotes = {};
const keyBindings = [];
const keyMap = "1234567890qwertyuiopasdfghjklzxcvbnm,.;/";

const select = document.getElementById("scaleSelect");
const container = document.getElementById("scaleContainer");

// fallback local scales
const fallbackScales = {
  salendro: [...],
  degung: [...],
  // isinya persis yg udah kamu punya
};

function buildScaleUI(rows, scaleName) {
  container.innerHTML = "";
  keyBindings.length = 0;
  let idx = 0;
  for (let o=0; o<5; o++) {
    rows.forEach((note,i)=>{
      const cents = note.cents + (1200*o);
      const keyId = scaleName+o+i;
      const keyChar = keyMap[idx++] || "";
      const a = document.createElement('a');
      a.className = note.cls;
      a.innerHTML = `${note.name}<br>[${keyChar}]<br>${cents}c`;
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

function startNote(...) {...}
function stopNote(...) {...}
function getBaseFreq() {...}
function midiToHz(...) {...}

// load scale.json
fetch('scale.json')
  .then(res => res.json())
  .then(data => {
    data.scales.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.name;
      opt.innerText = s.name;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => {
      const scale = data.scales.find(sc => sc.name === select.value);
      buildScaleUI(scale.notes.map((c, i) => ({
        name: `${i+1}`,
        cents: c,
        cls: ["ruby","orng","emra","turq","amet","gold","moss","aqua"][i%8]
      })), scale.name);
    });
    // render pertama
    const scale = data.scales[0];
    select.value = scale.name;
    buildScaleUI(scale.notes.map((c, i) => ({
      name: `${i+1}`,
      cents: c,
      cls: ["ruby","orng","emra","turq","amet","gold","moss","aqua"][i%8]
    })), scale.name);
  })
  .catch(() => {
    // fallback
    Object.keys(fallbackScales).forEach(name=>{
      const opt = document.createElement("option");
      opt.value = name;
      opt.innerText = name;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => {
      buildScaleUI(fallbackScales[select.value], select.value);
    });
    select.value = "salendro";
    buildScaleUI(fallbackScales.salendro, "salendro");
  });

// keyboard
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const b = keyBindings.find(b => b.key === e.key);
  if (b) startNote(b.id, b.cents);
});
document.addEventListener('keyup', (e) => {
  const b = keyBindings.find(b => b.key === e.key);
  if (b) stopNote(b.id);
});
