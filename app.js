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