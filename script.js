// ==========================================
// Particles Canvas
// ==========================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let width, height;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = Math.random() > 0.5 ? '#7C3AED' : '#00D4FF';
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    function init() {
        resize();
        particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resize);
    init();
    animate();
}

// ==========================================
// SVG Waveform Animation
// ==========================================
function initWaveforms() {
    const heroWave = document.getElementById('wave-path');
    const dividerWaves = [
        document.getElementById('divider-path'),
        document.getElementById('divider-path-2'),
        document.getElementById('divider-path-3'),
        document.getElementById('divider-path-4'),
        document.getElementById('divider-path-5')
    ].filter(Boolean);
    
    let phase = 0;
    
    function generateWavePath(amplitude = 20, frequency = 0.02, phaseShift = 0) {
        let d = '';
        const width = 1200;
        const height = 80;
        const centerY = height / 2;
        
        for (let x = 0; x <= width; x += 4) {
            const y = centerY + 
                Math.sin(x * frequency + phaseShift) * amplitude * 0.5 +
                Math.sin(x * frequency * 2.5 + phaseShift * 1.5) * amplitude * 0.3 +
                Math.sin(x * frequency * 0.5 + phaseShift * 0.7) * amplitude * 0.2;
            
            if (x === 0) {
                d = `M ${x} ${y}`;
            } else {
                d += ` L ${x} ${y}`;
            }
        }
        return d;
    }
    
    function animateWaves() {
        phase += 0.03;
        if (heroWave) {
            heroWave.setAttribute('d', generateWavePath(30, 0.015, phase));
        }
        dividerWaves.forEach((wave, i) => {
            wave.setAttribute('d', generateWavePath(20, 0.012, phase + i * 0.5));
        });
        requestAnimationFrame(animateWaves);
    }
    
    animateWaves();
}

// ==========================================
// MFCC Grid Visualization
// ==========================================
function initMfccGrid() {
    const grid = document.getElementById('mfcc-grid');
    if (!grid) return;
    
    for (let i = 0; i < 13 * 20; i++) {
        const cell = document.createElement('div');
        cell.className = 'mfcc-cell';
        
        const colors = [
            '#07070F',
            '#1E1E38',
            '#3A1F6E',
            '#5C2DB5',
            '#7C3AED',
            '#00D4FF'
        ];
        
        const randomIndex = Math.floor(Math.random() * colors.length);
        cell.style.backgroundColor = colors[randomIndex];
        grid.appendChild(cell);
        
        setInterval(() => {
            const newIndex = Math.floor(Math.random() * colors.length);
            cell.style.backgroundColor = colors[newIndex];
        }, 500 + Math.random() * 1000);
    }
}

// ==========================================
// Sticky Nav
// ==========================================
function initNav() {
    const nav = document.getElementById('sticky-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ==========================================
// Scroll Reveal
// ==========================================
function initScrollReveal() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('reveal'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// ==========================================
// Pyodide & Code Editor
// ==========================================
let pyodide = null;
let pyodideReady = false;
let audioData = null;

const codeExamples = {
    pipeline: `# Exemplo 1 - Pipeline Completo
# Simulação de análise de áudio
import numpy as np

print("="*40)
print("LIBROSA - ANÁLISE DE ÁUDIO")
print("="*40)
print()

# Dados de exemplo
sr = 22050
duration = 3.0
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
y = np.sin(2 * np.pi * 440 * t) + 0.3 * np.sin(2 * np.pi * 880 * t)

print(f"✓ Áudio carregado: {duration:.1f}s, {sr} Hz")
print()

# Extração de features
print("Extraindo MFCCs...")
n_mfcc = 13
mfccs = np.random.randn(n_mfcc, 100)  # Simulação
print(f"✓ MFCCs extraídos: {mfccs.shape}")
print()

# Beat tracking
print("Detectando beats...")
tempo = 120.0
beats = np.arange(0, duration, 60/tempo)
print(f"✓ Tempo estimado: {tempo:.1f} BPM")
print(f"✓ Beats detectados: {len(beats)}")
print()

print("="*40)
print("ANÁLISE CONCLUÍDA!")
print("="*40)
`,
    mfcc: `# Exemplo 2 - Extração de MFCCs
import numpy as np

print("="*40)
print("MEL-FREQUENCY CEPSTRAL COEFFICIENTS")
print("="*40)
print()

print("MFCCs são características amplamente usadas em:")
print("- Reconhecimento de fala")
print("- Classificação de música")
print("- Detecção de emoções")
print()

n_mfcc = 13
print(f"Número de coeficientes: {n_mfcc}")
print()
print("Os primeiros coeficientes representam as")
print("características mais importantes do timbre.")
`,
    beat: `# Exemplo 3 - Detecção de Beats
import numpy as np

print("="*40)
print("DETECÇÃO DE BATIDAS (BEAT TRACKING)")
print("="*40)
print()

# Simulação
tempo = 128.0
print(f"Tempo estimado: {tempo:.1f} BPM")
print()

print("Aplicações:")
print("- Sincronização de playlists")
print("- Jogos de ritmo")
print("- Edição de vídeo")
`
};

async function initPyodide() {
    const terminal = document.getElementById('terminal-pre');
    if (!terminal) return;
    
    try {
        terminal.textContent = 'Carregando ambiente Python...\n';
        
        pyodide = await loadPyodide();
        await pyodide.loadPackage('numpy');
        
        pyodideReady = true;
        terminal.textContent += '✓ Ambiente Python carregado!\n';
        terminal.textContent += 'Clique em "Executar" para rodar o código.\n';
    } catch (err) {
        terminal.textContent += 'Erro ao carregar Pyodide: ' + err.message + '\n';
    }
}

async function runCode() {
    const codeEditor = document.getElementById('code-editor');
    const terminal = document.getElementById('terminal-pre');
    const runBtn = document.getElementById('run-btn');
    const code = codeEditor.value;
    
    runBtn.disabled = true;
    runBtn.textContent = 'Executando...';
    terminal.textContent = '';
    
    try {
        if (!pyodideReady) {
            terminal.textContent = 'Aguardando inicialização do Pyodide...\n';
            await initPyodide();
        }
        
        pyodide.runPython(`
import sys
from io import StringIO
old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()
`);
        
        pyodide.runPython(code);
        
        const output = pyodide.runPython(`
sys.stdout = old_stdout
mystdout.getvalue()
`);
        
        terminal.textContent = output || 'Código executado (sem saída).';
        
    } catch (err) {
        terminal.textContent = '✗ Erro: ' + err.message;
    }
    
    runBtn.disabled = false;
    runBtn.textContent = '▶ Executar';
}

// ==========================================
// Drag & Drop Audio
// ==========================================
function initDragDrop() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const canvas = document.getElementById('waveform-canvas');
    
    if (!dropzone || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    function drawWaveformFromBuffer(buffer) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const data = buffer.getChannelData(0);
        
        ctx.clearRect(0, 0, width, height);
        
        const step = Math.ceil(data.length / width);
        const amp = height / 2;
        
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#7C3AED');
        gradient.addColorStop(0.5, '#00D4FF');
        gradient.addColorStop(1, '#FF2D78');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, amp);
        
        for (let i = 0; i < width; i++) {
            let min = 1.0;
            let max = -1.0;
            for (let j = 0; j < step; j++) {
                const datum = data[(i * step) + j];
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
            ctx.lineTo(i, amp + min * amp * 0.8);
            ctx.lineTo(i, amp + max * amp * 0.8);
        }
        
        ctx.stroke();
    }
    
    function drawPlaceholderWaveform() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const amp = height / 2;
        let phase = 0;
        
        function animate() {
            if (audioData) return;
            
            phase += 0.05;
            ctx.clearRect(0, 0, width, height);
            
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, '#7C3AED');
            gradient.addColorStop(0.5, '#00D4FF');
            gradient.addColorStop(1, '#FF2D78');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let x = 0; x < width; x++) {
                const y = amp + 
                    Math.sin(x * 0.02 + phase) * amp * 0.4 +
                    Math.sin(x * 0.05 + phase * 1.5) * amp * 0.2;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            requestAnimationFrame(animate);
        }
        animate();
    }
    
    drawPlaceholderWaveform();
    
    async function handleFile(file) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        
        audioData = audioBuffer;
        
        fileInfo.style.display = 'block';
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-duration').textContent = (audioBuffer.duration).toFixed(2) + ' s';
        document.getElementById('file-sr').textContent = audioBuffer.sampleRate + ' Hz';
        
        drawWaveformFromBuffer(audioBuffer);
        
        if (pyodideReady) {
            const monoData = audioBuffer.getChannelData(0);
            try {
                pyodide.globals.set('y', monoData);
                pyodide.globals.set('sr', audioBuffer.sampleRate);
            } catch (e) {
                console.log('Pyodide not ready for globals');
            }
        }
    }
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.add('drag-over'));
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.remove('drag-over'));
    });
    
    dropzone.addEventListener('drop', e => {
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });
    
    fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });
}

// ==========================================
// Example Selector & Buttons
// ==========================================
function initControls() {
    const select = document.getElementById('examples');
    const codeEditor = document.getElementById('code-editor');
    const runBtn = document.getElementById('run-btn');
    const resetBtn = document.getElementById('reset-btn');
    const terminal = document.getElementById('terminal-pre');
    
    // Initialize with first example
    codeEditor.value = codeExamples.pipeline;
    
    if (select) {
        select.addEventListener('change', () => {
            codeEditor.value = codeExamples[select.value];
        });
    }
    
    if (runBtn) {
        runBtn.addEventListener('click', runCode);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            codeEditor.value = codeExamples.pipeline;
            if (select) select.value = 'pipeline';
            if (terminal) {
                terminal.textContent = 'Terminal resetado.\n';
            }
        });
    }
}

// ==========================================
// Initialize All
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initWaveforms();
    initMfccGrid();
    initNav();
    initScrollReveal();
    initPyodide();
    initDragDrop();
    initControls();
});
