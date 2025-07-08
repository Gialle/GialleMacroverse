fetch('scales.json')
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById('scale-select');
    data.scales.forEach(scale => {
      const opt = document.createElement('option');
      opt.value = scale.name;
      opt.innerText = scale.name;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => {
      const selectedScale = data.scales.find(s => s.name === select.value);
      renderScale(selectedScale);
    });
  });

function renderScale(scale) {
  const container = document.getElementById("notes-container");
  container.innerHTML = `<h2>${scale.name}</h2>`;
  
  scale.notes.forEach(cent => {
    const btn = document.createElement("a");
    btn.className = "ruby";
    btn.innerText = `${cent}¢`;
    container.appendChild(btn);
  });
}
