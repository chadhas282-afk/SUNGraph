document.addEventListener('DOMContentLoaded', () => {

    const chatHistory = document.getElementById('chat-history');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const modeToggle = document.getElementById('mode-toggle');
    const scoreContainer = document.getElementById('score-container');
    const scoreValue = document.getElementById('score-value');
    const labelSimple = document.getElementById('label-simple');
    const labelGame = document.getElementById('label-game');

    const calcElt = document.getElementById('calculator-container');
    const calculator = Desmos.GraphingCalculator(calcElt, {
        keypad: false,
        expressions: false,
        settingsMenu: false,
        zoomButtons: true,
        border: false,
        invertedColors: true
    });

    let isGameMode = false;
    let score = 0;

    const shapes = [
        { latex: 'x^2+y^2=25', name: 'Circle' },
        { latex: 'y=\\left|x\\right|', name: 'Modulus' },
        { latex: 'y=x^3', name: 'Cubic Curve' },
        { latex: 'y=x', name: 'Line' },
        { latex: 'y=x^2', name: 'Parabola' },
        { latex: 'y=\\sin(x)', name: 'Wave' },
        { latex: 'x^2/16+y^2/9=1', name: 'Ellipse' },
        { latex: 'x^2-y^2=1', name: 'Hyperbola' },
        { latex: 'y=e^x', name: 'Exponential Curve' },
        { latex: 'y=\\ln(x)', name: 'Logarithmic Curve' },
        { latex: 'y=\\tan(x)', name: 'Tangent Wave' },
        { latex: 'y=\\left|\\left|x\\right|-2\\right|', name: 'W-Shape' },
        { latex: '(x^2+y^2-1)^3-x^2y^3=0', name: 'Heart' },
        { latex: 'r=\\theta', name: 'Spiral' },
        { latex: 'r=1-\\sin(\\theta)', name: 'Cardioid' },
        { latex: 'r=\\cos(4\\theta)', name: 'Rose' },
        { latex: 'x^{2/3}+y^{2/3}=1', name: 'Asteroid' },
        { latex: 'y=1/x', name: 'Reciprocal Curve' },
        { latex: 'y=\\sqrt{x}', name: 'Square Root Curve' },
        { latex: 'y=\\sqrt[3]{x}', name: 'Cube Root Curve' },
        { latex: 'y=1/(1+e^{-x})', name: 'Sigmoid Curve' },
        { latex: 'y=\\lfloor x \\rfloor', name: 'Step Function' }
    ];

    function plotGraph(latexString) {

        let formattedLatex = latexString
            .replace(/\\?sin/g, '\\sin')
            .replace(/\\?cos/g, '\\cos')
            .replace(/\\?tan/g, '\\tan')
            .replace(/\\?log/g, '\\log')
            .replace(/\\?ln/g, '\\ln')
            .replace(/\|([a-zA-Z0-9_+ -]+)\|/g, '\\left|$1\\right|');
            
        calculator.setExpression({ id: 'current-graph', latex: formattedLatex, color: Desmos.Colors.BLUE });
    }

    function clearGraph() {
        calculator.removeExpression({ id: 'current-graph' });
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message max-w-[82%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
            sender === 'user'
                ? 'self-end glass-user rounded-br-sm'
                : 'self-start glass-bot rounded-bl-sm'
        }`;
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        msgDiv.innerHTML = formattedText;
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

     function showTypingIndicator(callback) {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message self-start glass-bot rounded-2xl rounded-bl-sm px-5 py-3 max-w-[80%] typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatHistory.appendChild(typingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        setTimeout(() => {
            const el = document.getElementById('typing-indicator');
            if (el) el.remove();
            callback();
        }, 800 + Math.random() * 500);
    }

    function spawnFloatingScore() {
        const floater = document.createElement('div');
        floater.className = 'fixed font-black text-2xl floating-score select-none pointer-events-none z-50';
        floater.innerText = '+10';
        const rect = scoreContainer.getBoundingClientRect();
        floater.style.left = (rect.left + rect.width / 2 - 14) + 'px';
        floater.style.top = (rect.top) + 'px';
        document.body.appendChild(floater);
        setTimeout(() => floater.remove(), 1000);
    }

    function setScore(newScore) {
        if (newScore > score) spawnFloatingScore();
        score = newScore;
        scoreValue.innerText = score;
        scoreValue.classList.add('scale-150', 'text-white');
        setTimeout(() => {
            scoreValue.classList.remove('scale-150', 'text-white');
        }, 200);
    }

    function appendMCQ(options, currentShape, type) {
        const mcqContainer = document.createElement('div');
        mcqContainer.className = 'chat-message self-start max-w-[92%] grid grid-cols-2 gap-2 w-full';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'mcq-btn';
            btn.innerText = opt;
            btn.addEventListener('click', function() {
                const allBtns = mcqContainer.querySelectorAll('button');
                allBtns.forEach(b => {
                    b.disabled = true;
                    b.style.cursor = 'not-allowed';
                    b.style.opacity = '0.45';
                });
                const isCorrect = (type === 'name') ? (opt === currentShape.name) : (opt === currentShape.latex);
                if (isCorrect) {
                    btn.style.background = 'linear-gradient(135deg,rgba(5,78,22,0.9),rgba(6,95,70,0.9))';
                    btn.style.borderColor = 'rgba(34,197,94,0.7)';
                    btn.style.color = '#86efac';
                    btn.style.opacity = '1';
                    setScore(score + 10);
                } else {
                    btn.style.background = 'linear-gradient(135deg,rgba(69,10,10,0.9),rgba(60,5,5,0.9))';
                    btn.style.borderColor = 'rgba(239,68,68,0.7)';
                    btn.style.color = '#fca5a5';
                    btn.style.opacity = '1';
                    const correctStr = (type === 'name') ? currentShape.name : currentShape.latex;
                    allBtns.forEach(b => {
                        if (b.innerText === correctStr) {
                            b.style.background = 'linear-gradient(135deg,rgba(5,78,22,0.9),rgba(6,95,70,0.9))';
                            b.style.borderColor = 'rgba(34,197,94,0.7)';
                            b.style.color = '#86efac';
                            b.style.opacity = '1';
                        }
                    });
                }
                showTypingIndicator(() => {
                    plotGraph(currentShape.latex);
                    if (isCorrect) {
                        appendMessage('bot', '🎉 **Correct!** It is **' + currentShape.name + '**.');
                    } else {
                        appendMessage('bot', '❌ **Incorrect!** The answer was **' + currentShape.name + '**.');
                    }
                    setTimeout(startGameRound, 2500);
                });
            });
            mcqContainer.appendChild(btn);
        });
        chatHistory.appendChild(mcqContainer);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGameRound() {
        if (!isGameMode) return;
        clearGraph();

        const shuffledShapes = shuffle([...shapes]);
        const correctShape = shuffledShapes[0];
        const wrongShapes = shuffledShapes.slice(1, 4);

        const typeIdx = Math.floor(Math.random() * 2);
        
        showTypingIndicator(() => {
            if (typeIdx === 0) {
                appendMessage('bot', `What is the shape of this equation: **${correctShape.latex}**?`);
                let options = [correctShape.name, ...wrongShapes.map(s => s.name)];
                appendMCQ(shuffle(options), correctShape, 'name');
            } else {
                plotGraph(correctShape.latex);
                appendMessage('bot', `What is the equation for the graph shown on the right?`);
                let options = [correctShape.latex, ...wrongShapes.map(s => s.latex)];
                appendMCQ(shuffle(options), correctShape, 'latex');
            }
        });
    }
