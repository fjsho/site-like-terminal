const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalBody = document.getElementById('terminal-body');

let commandHistory = [];
let historyIndex = -1;

const commands = {
    help: {
        description: 'Show available commands',
        execute: () => {
            return `
<span class="success">Available Commands:</span>
  <span class="command">help</span>     - Show this help message
  <span class="command">date</span>     - Display current date and time
  <span class="command">about</span>    - Display about this weh site
  <span class="command">exit</span>     - Close the terminal and go to the github page`;
        }
    },
    date: {
        description: 'Show current date and time',
        execute: () => {
            const now = new Date();
            return `<span class="info">${now.toLocaleString('ja-JP', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })}</span>`;
        }
    },
    about: {
        description: 'Display about this page',
        execute: () => {
            return `<span class="info">Web Terminal Project
This is a web-based terminal emulator built with HTML, CSS, and JavaScript.
Feel free to explore and use the available commands!</span>`;
        }
    },
    exit: {
        description: 'Exit the terminal',
        execute: () => {
            return '<span class="warning">Goodbye! Terminal session ended.</span>';
        }
    }
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const input = terminalInput.value.trim();
        
        if (input) {
            commandHistory.push(input);
            historyIndex = commandHistory.length;
            
            // Add command to output
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-line';
            commandLine.innerHTML = `<span class="prompt">terminal-style-website:~$</span> <span class="command">${input}</span>`;
            terminalOutput.appendChild(commandLine);
            
            // Process command
            const [cmd, ...args] = input.split(' ');
            
            if (commands[cmd]) {
                const output = commands[cmd].execute(args);
                if (output) {
                    const outputLine = document.createElement('div');
                    outputLine.className = 'terminal-line';
                    outputLine.innerHTML = output;
                    terminalOutput.appendChild(outputLine);
                }
            } else if (input !== '') {
                const errorLine = document.createElement('div');
                errorLine.className = 'terminal-line';
                errorLine.innerHTML = `<span class="error">${cmd}: command not found</span>`;
                terminalOutput.appendChild(errorLine);
            }
            
            terminalInput.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            terminalInput.value = '';
        }
    } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        terminalOutput.innerHTML = '';
    }
});

// Keep focus on input
terminalBody.addEventListener('click', () => {
    terminalInput.focus();
});

// Window control buttons
document.querySelector('.terminal-button.close').addEventListener('click', () => {
    document.querySelector('.terminal-container').style.display = 'none';
});

document.querySelector('.terminal-button.minimize').addEventListener('click', () => {
    terminalBody.style.display = terminalBody.style.display === 'none' ? 'block' : 'none';
});

document.querySelector('.terminal-button.maximize').addEventListener('click', () => {
    const container = document.querySelector('.terminal-container');
    if (container.style.width === '100vw') {
        container.style.width = '100%';
        container.style.maxWidth = '900px';
        container.style.height = 'auto';
        terminalBody.style.height = '500px';
    } else {
        container.style.width = '100vw';
        container.style.maxWidth = '100vw';
        container.style.height = '100vh';
        terminalBody.style.height = 'calc(100vh - 44px)';
    }
});
