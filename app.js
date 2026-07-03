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
