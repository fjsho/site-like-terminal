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
  <span class="command">clear</span>    - Clear the terminal screen
  <span class="command">date</span>     - Display current date and time
  <span class="command">echo</span>     - Display a message
  <span class="command">ls</span>       - List directory contents
  <span class="command">pwd</span>      - Print working directory
  <span class="command">whoami</span>   - Display current user
  <span class="command">cat</span>      - Display file contents
  <span class="command">mkdir</span>    - Create a directory
  <span class="command">touch</span>    - Create a file
  <span class="command">rm</span>       - Remove files
  <span class="command">cd</span>       - Change directory
  <span class="command">history</span>  - Show command history
  <span class="command">neofetch</span> - Display system information
  <span class="command">exit</span>     - Close the terminal`;
        }
    },
    clear: {
        description: 'Clear the terminal',
        execute: () => {
            terminalOutput.innerHTML = '';
            return null;
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
    echo: {
        description: 'Display a message',
        execute: (args) => {
            return args.join(' ') || '';
        }
    },
    ls: {
        description: 'List directory contents',
        execute: () => {
            return `<span class="directory">Documents/</span>  <span class="directory">Downloads/</span>  <span class="directory">Pictures/</span>  <span class="directory">Videos/</span>
<span class="file">README.md</span>  <span class="executable">script.sh</span>  <span class="file">config.json</span>  <span class="file">notes.txt</span>`;
        }
    },
    pwd: {
        description: 'Print working directory',
        execute: () => {
            return '<span class="info">/home/user</span>';
        }
    },
    whoami: {
        description: 'Display current user',
        execute: () => {
            return '<span class="info">user</span>';
        }
    },
    cat: {
        description: 'Display file contents',
        execute: (args) => {
            if (!args[0]) {
                return '<span class="error">cat: missing file operand</span>';
            }
            if (args[0] === 'README.md') {
                return `<span class="output"># Web Terminal Project
This is a web-based terminal emulator built with HTML, CSS, and JavaScript.
Feel free to explore and use the available commands!</span>`;
            }
            return `<span class="error">cat: ${args[0]}: No such file or directory</span>`;
        }
    },
    mkdir: {
        description: 'Create a directory',
        execute: (args) => {
            if (!args[0]) {
                return '<span class="error">mkdir: missing operand</span>';
            }
            return `<span class="success">Directory '${args[0]}' created successfully</span>`;
        }
    },
    touch: {
        description: 'Create a file',
        execute: (args) => {
            if (!args[0]) {
                return '<span class="error">touch: missing file operand</span>';
            }
            return `<span class="success">File '${args[0]}' created successfully</span>`;
        }
    },
    rm: {
        description: 'Remove files',
        execute: (args) => {
            if (!args[0]) {
                return '<span class="error">rm: missing operand</span>';
            }
            return `<span class="warning">File '${args[0]}' removed</span>`;
        }
    },
    cd: {
        description: 'Change directory',
        execute: (args) => {
            if (!args[0] || args[0] === '~') {
                return '<span class="info">Changed to home directory</span>';
            }
            return `<span class="info">Changed directory to ${args[0]}</span>`;
        }
    },
    history: {
        description: 'Show command history',
        execute: () => {
            if (commandHistory.length === 0) {
                return '<span class="info">No commands in history</span>';
            }
            return commandHistory.map((cmd, index) => 
                `<span class="output">  ${index + 1}  ${cmd}</span>`
            ).join('\n');
        }
    },
    neofetch: {
        description: 'Display system information',
        execute: () => {
            return `<span class="info">
       _____       <span class="output">user@localhost</span>
      /     \\      <span class="output">--------------</span>
     /  ^ ^  \\     <span class="success">OS:</span> Web OS 1.0
    |   > <   |    <span class="success">Host:</span> Browser Terminal
    |   ___   |    <span class="success">Kernel:</span> JavaScript ES6
     \\_____/      <span class="success">Uptime:</span> ${Math.floor(Math.random() * 100)} hours
                   <span class="success">Shell:</span> web-bash 5.0
                   <span class="success">Terminal:</span> WebTerm v1.0
                   <span class="success">CPU:</span> Intel Core i7
                   <span class="success">Memory:</span> 16GB RAM
</span>`;
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
            commandLine.innerHTML = `<span class="prompt">user@localhost:~$</span> <span class="command">${input}</span>`;
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
                errorLine.innerHTML = `<span class="error">bash: ${cmd}: command not found</span>`;
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
