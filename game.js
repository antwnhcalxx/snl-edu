class SnakeAndLaddersGame {
    constructor() {
        this.canvas = document.getElementById('gameBoard');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 100; // 1000px / 10 cells = 100px per cell
        this.players = ['Green', 'Red'];
        this.positions = [1, 1]; // Start from position 1
        this.currentPlayer = 0;
        this.diceValues = [1, 1];
        this.isRolling = false;
        this.specialTiles = [15, 30, 45, 60, 75, 90, 93, 96];
        
        // Light colors for tiles
        this.tileColors = [
            '#FFE4E1', '#E6E6FA', '#F0FFF0', '#FFF0F5', 
            '#F0FFFF', '#FFF5EE', '#F5F5DC', '#FAFAD2',
            '#E0FFFF', '#FFE4B5', '#F0F8FF', '#F5F5F5',
            '#FFEFD5', '#F0FFF0', '#FFF5EE'
        ];
        
        // Randomize snakes and ladders with better distribution
        this.snakes = this.randomizeSnakesAndLadders(3, 20, 99, 1, 19);
        this.ladders = this.randomizeSnakesAndLadders(3, 1, 19, 20, 99);
        
        this.questions = {
            snake: [
                { question: "Ο αγώνας για την ισότητα των φύλων στην Ευρώπη χωρίζεται σε τέσσερις φάσεις.", answer: "Σωστό" },
                { question: "Ο νόμος για την ισότητα των φύλων στις εργασιακές σχέσεις στην Ευρώπη τέθηκε σε ισχύ το 2006.", answer: "Σωστό" },
                { question: "Ο νόμος για την ισότητα των φύλων στην Ελλάδα τέθηκε σε ισχύ το 2010.", answer: "Σωστό" },
                { question: "Δεν υπάρχουν προκαταλήψεις ανάμεσα στα δύο φύλα σήμερα.", answer: "Λάθος" },
                { question: "Οι γυναίκες έχουν περισσότερα δικαιώματα απ' ό,τι στο παρελθόν.", answer: "Σωστό" },
                { question: "Η εκπαίδευση δεν παίζει κανέναν ρόλο στην καταπολέμηση των στερεοτύπων φύλου.", answer: "Λάθος" },
                { question: "Η συμμετοχή των γυναικών στα κέντρα λήψης αποφάσεων είναι απαραίτητη για τη δημοκρατία.", answer: "Σωστό" },
                { question: "Η έννοια της ισότητας σημαίνει ότι όλοι οι άνθρωποι έχουν τις ίδιες ευκαιρίες και δικαιώματα.", answer: "Σωστό" }
            ],
            ladder: [
                { question: "Οι γυναίκες προσλαμβάνονται συχνότερα από τους άντρες σε διευθυντικές θέσεις.", answer: "Λάθος" },
                { question: "Οι γυναίκες εκπροσωπούνται περισσότερο από τους άνδρες στον πολιτικό χώρο.", answer: "Λάθος" },
                { question: "Σε όλα τα επαγγέλματα οι γυναίκες αντιμετωπίζονται ισότιμα με τους άντρες.", answer: "Λάθος" },
                { question: "Η ισότητα των φύλων είναι κατοχυρωμένο δικαίωμα σε όλες τις ευρωπαϊκές χώρες.", answer: "Σωστό" },
                { question: "Η έμφυλη βία είναι ένα από τα εμπόδια για την επίτευξη ισότητας.", answer: "Σωστό" },
                { question: "Η Ευρωπαϊκή Ένωση έχει λάβει μέτρα για την ισότητα των φύλων στον χώρο εργασίας.", answer: "Σωστό" },
                { question: "Τα μέσα μαζικής ενημέρωσης δεν επηρεάζουν τις αντιλήψεις μας για τα φύλα.", answer: "Λάθος" },
                { question: "Η κατανομή των οικιακών υποχρεώσεων στην οικογένεια είναι ισότιμη σήμερα.", answer: "Λάθος" }
            ],
            star: [
                { question: "Η ισότητα των φύλων αφορά μόνο τις γυναίκες.", answer: "Λάθος" },
                { question: "Οι γυναίκες μπορούν σήμερα να ψηφίζουν στις περισσότερες χώρες του κόσμου.", answer: "Σωστό" },
                { question: "Η πατρική άδεια (άδεια πατρότητας) είναι μια μορφή ενίσχυσης της ισότητας των φύλων.", answer: "Σωστό" },
                { question: "Οι μισθοί ανδρών και γυναικών είναι πάντοτε ίσοι για την ίδια εργασία.", answer: "Λάθος" },
                { question: "Η ισότητα των φύλων είναι στόχος των Ηνωμένων Εθνών.", answer: "Σωστό" },
                { question: "Το δικαίωμα ψήφου των γυναικών στην Ελλάδα κατοχυρώθηκε το 1952.", answer: "Σωστό" },
                { question: "Οι γυναίκες είχαν δικαίωμα να σπουδάζουν από την αρχή της ίδρυσης των πανεπιστημίων.", answer: "Λάθος" },
                { question: "Η ευαισθητοποίηση των νέων γύρω από την ισότητα των φύλων μπορεί να αλλάξει το μέλλον.", answer: "Σωστό" }
            ]
        };

        this.initializeGame();
    }

    initializeGame() {
        this.drawBoard();
        this.setupEventListeners();
    }

    drawBoard() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid (10x10)
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                const number = this.getBoardNumber(row, col);

                // Draw cell with random light color
                if (this.specialTiles.includes(number)) {
                    this.ctx.fillStyle = '#e3f2fd';
                } else if (number === 1) {
                    this.ctx.fillStyle = '#ffeb3b';
                } else if (number === 100) {
                    this.ctx.fillStyle = '#ffd700';
                } else {
                    const colorIndex = (row * 10 + col) % this.tileColors.length;
                    this.ctx.fillStyle = this.tileColors[colorIndex];
                }
                this.ctx.strokeStyle = '#000';
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);

                // Draw number with thicker font
                this.ctx.fillStyle = '#444444';
                this.ctx.font = 'bold 28px "Arial Rounded MT Bold", Arial, sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(number, x + this.cellSize/2, y + this.cellSize/2);

                // Draw special tile indicator
                if (this.specialTiles.includes(number)) {
                    this.ctx.fillStyle = '#2196f3';
                    this.ctx.font = 'bold 24px Arial';
                    this.ctx.fillText('★', x + this.cellSize/2, y + this.cellSize/2 + 20);
                }

                // Draw start line and text
                if (number === 1) {
                    // Draw start line
                    this.ctx.strokeStyle = '#000';
                    this.ctx.lineWidth = 3;
                    this.ctx.setLineDash([5, 5]);
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + 10, y + this.cellSize - 10);
                    this.ctx.lineTo(x + this.cellSize - 10, y + this.cellSize - 10);
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);

                    // Draw "START" text
                    this.ctx.fillStyle = '#000';
                    this.ctx.font = 'bold 16px Arial';
                    this.ctx.fillText('START', x + this.cellSize/2, y + this.cellSize/2 + 20);
                }

                // Draw trophy on 100
                if (number === 100) {
                    this.ctx.fillStyle = '#ffd700';
                    this.ctx.font = 'bold 24px Arial';
                    this.ctx.fillText('🏆', x + this.cellSize/2, y + this.cellSize/2 + 20);
                }
            }
        }

        // Draw snakes and ladders
        this.drawSnakesAndLadders();
        
        // Draw players
        this.drawPlayers();
    }

    drawSnakesAndLadders() {
        // Draw snakes with different colors
        const snakeColors = [
            { main: '#32CD32', pattern: '#228B22' }, // Green
            { main: '#FF4500', pattern: '#CD3700' }, // Orange-Red
            { main: '#4169E1', pattern: '#27408B' }  // Royal Blue
        ];
        
        let colorIndex = 0;
        for (const [start, end] of Object.entries(this.snakes)) {
            const startPos = this.getCoordinates(parseInt(start));
            const endPos = this.getCoordinates(parseInt(end));
            
            // Calculate control points for the snake's S-curve
            const dx = endPos.x - startPos.x;
            const dy = endPos.y - startPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Create multiple control points for S-curve
            const cp1x = startPos.x + dx * 0.25 + (dx < 0 ? -40 : 40);
            const cp1y = startPos.y + dy * 0.25;
            const cp2x = startPos.x + dx * 0.75 + (dx < 0 ? 40 : -40);
            const cp2y = startPos.y + dy * 0.75;
            
            // Draw snake body (main shape)
            this.ctx.beginPath();
            this.ctx.moveTo(startPos.x, startPos.y);
            this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endPos.x, endPos.y);
            this.ctx.lineWidth = 30;
            this.ctx.strokeStyle = snakeColors[colorIndex].main;
            this.ctx.stroke();

            // Draw snake tail with more detail
            const tailAngle = Math.atan2(endPos.y - cp2y, endPos.x - cp2x);
            
            // Draw tail base
            this.ctx.beginPath();
            this.ctx.fillStyle = snakeColors[colorIndex].main;
            this.ctx.moveTo(endPos.x, endPos.y);
            this.ctx.lineTo(
                endPos.x - Math.cos(tailAngle - Math.PI/6) * 30,
                endPos.y - Math.sin(tailAngle - Math.PI/6) * 30
            );
            this.ctx.lineTo(
                endPos.x - Math.cos(tailAngle + Math.PI/6) * 30,
                endPos.y - Math.sin(tailAngle + Math.PI/6) * 30
            );
            this.ctx.closePath();
            this.ctx.fill();

            // Draw tail tip with multiple segments for a more natural look
            const tailLength = 20;
            const segments = 5;
            for (let i = 0; i < segments; i++) {
                const t = i / segments;
                const width = 30 * (1 - t);
                const length = tailLength * t;
                
                this.ctx.beginPath();
                this.ctx.fillStyle = snakeColors[colorIndex].main;
                this.ctx.moveTo(
                    endPos.x - Math.cos(tailAngle) * length,
                    endPos.y - Math.sin(tailAngle) * length
                );
                this.ctx.lineTo(
                    endPos.x - Math.cos(tailAngle - Math.PI/6) * width - Math.cos(tailAngle) * length,
                    endPos.y - Math.sin(tailAngle - Math.PI/6) * width - Math.sin(tailAngle) * length
                );
                this.ctx.lineTo(
                    endPos.x - Math.cos(tailAngle + Math.PI/6) * width - Math.cos(tailAngle) * length,
                    endPos.y - Math.sin(tailAngle + Math.PI/6) * width - Math.sin(tailAngle) * length
                );
                this.ctx.closePath();
                this.ctx.fill();
            }

            // Draw snake patterns (darker shapes)
            const totalPatterns = 20;
            for (let i = 0; i <= totalPatterns; i++) {
                const t = i / totalPatterns;
                const x = this.bezierPoint(startPos.x, cp1x, cp2x, endPos.x, t);
                const y = this.bezierPoint(startPos.y, cp1y, cp2y, endPos.y, t);
                
                // Calculate angle for the pattern
                const tx = this.bezierTangent(startPos.x, cp1x, cp2x, endPos.x, t);
                const ty = this.bezierTangent(startPos.y, cp1y, cp2y, endPos.y, t);
                const angle = Math.atan2(ty, tx);
                
                // Draw pattern
                this.ctx.fillStyle = snakeColors[colorIndex].pattern;
                this.ctx.beginPath();
                this.ctx.ellipse(
                    x + Math.cos(angle + Math.PI/2) * 10,
                    y + Math.sin(angle + Math.PI/2) * 10,
                    8, 4, angle, 0, Math.PI
                );
                this.ctx.fill();
            }

            // Draw snake head
            const headAngle = Math.atan2(cp1y - startPos.y, cp1x - startPos.x);
            
            // Head shape
            this.ctx.beginPath();
            this.ctx.fillStyle = snakeColors[colorIndex].main;
            this.ctx.ellipse(startPos.x, startPos.y, 20, 15, headAngle, 0, Math.PI * 2);
            this.ctx.fill();

            // Eyes
            const eyeOffsetX = Math.cos(headAngle) * 12;
            const eyeOffsetY = Math.sin(headAngle) * 12;
            const eyeSpacingX = Math.cos(headAngle + Math.PI/2) * 8;
            const eyeSpacingY = Math.sin(headAngle + Math.PI/2) * 8;

            // Left eye
            this.ctx.beginPath();
            this.ctx.fillStyle = 'white';
            this.ctx.ellipse(
                startPos.x + eyeOffsetX + eyeSpacingX,
                startPos.y + eyeOffsetY + eyeSpacingY,
                4, 4, 0, 0, Math.PI * 2
            );
            this.ctx.fill();
            
            // Right eye
            this.ctx.beginPath();
            this.ctx.ellipse(
                startPos.x + eyeOffsetX - eyeSpacingX,
                startPos.y + eyeOffsetY - eyeSpacingY,
                4, 4, 0, 0, Math.PI * 2
            );
            this.ctx.fill();

            // Eye pupils
            this.ctx.fillStyle = 'black';
            this.ctx.beginPath();
            this.ctx.ellipse(
                startPos.x + eyeOffsetX + eyeSpacingX,
                startPos.y + eyeOffsetY + eyeSpacingY,
                2, 2, 0, 0, Math.PI * 2
            );
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.ellipse(
                startPos.x + eyeOffsetX - eyeSpacingX,
                startPos.y + eyeOffsetY - eyeSpacingY,
                2, 2, 0, 0, Math.PI * 2
            );
            this.ctx.fill();

            colorIndex = (colorIndex + 1) % snakeColors.length;
        }

        // Draw ladders (brown)
        for (const [start, end] of Object.entries(this.ladders)) {
            const startPos = this.getCoordinates(parseInt(start));
            const endPos = this.getCoordinates(parseInt(end));
            
            // Draw ladder sides
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#8B4513'; // Darker brown for sides
            this.ctx.lineWidth = 8; // Thicker sides
            
            // Calculate ladder width and angle
            const dx = endPos.x - startPos.x;
            const dy = endPos.y - startPos.y;
            const angle = Math.atan2(dy, dx);
            const width = 30; // Increased width
            
            // Calculate ladder length
            const length = Math.sqrt(dx * dx + dy * dy);
            
            // Draw left side with rounded ends
            const leftStartX = startPos.x + Math.sin(angle) * width;
            const leftStartY = startPos.y - Math.cos(angle) * width;
            const leftEndX = endPos.x + Math.sin(angle) * width;
            const leftEndY = endPos.y - Math.cos(angle) * width;
            
            // Draw right side with rounded ends
            const rightStartX = startPos.x - Math.sin(angle) * width;
            const rightStartY = startPos.y + Math.cos(angle) * width;
            const rightEndX = endPos.x - Math.sin(angle) * width;
            const rightEndY = endPos.y + Math.cos(angle) * width;
            
            // Draw sides with rounded caps
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(leftStartX, leftStartY);
            this.ctx.lineTo(leftEndX, leftEndY);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(rightStartX, rightStartY);
            this.ctx.lineTo(rightEndX, rightEndY);
            this.ctx.stroke();
            
            // Draw rungs
            const steps = 12; // More rungs
            this.ctx.lineWidth = 6; // Thicker rungs
            this.ctx.strokeStyle = '#A0522D'; // Slightly lighter brown for rungs
            
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x1 = leftStartX + (leftEndX - leftStartX) * t;
                const y1 = leftStartY + (leftEndY - leftStartY) * t;
                const x2 = rightStartX + (rightEndX - rightStartX) * t;
                const y2 = rightStartY + (rightEndY - rightStartY) * t;
                
                // Draw rung with shadow effect
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
                
                // Draw highlight on top of rung
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = '#D2691E';
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1 - 2);
                this.ctx.lineTo(x2, y2 - 2);
                this.ctx.stroke();
                
                // Reset for next rung
                this.ctx.lineWidth = 6;
                this.ctx.strokeStyle = '#A0522D';
            }
            
            // Reset line cap for other drawings
            this.ctx.lineCap = 'butt';
        }
    }

    drawPlayers() {
        this.positions.forEach((position, index) => {
            const pos = this.getCoordinates(position);
            this.ctx.beginPath();
            this.ctx.fillStyle = this.players[index].toLowerCase();
            this.ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    getBoardNumber(row, col) {
        // Calculate the number based on the row and column
        // Starting from bottom-right (1) to top-left (100)
        // We flip the row number since we want to start from bottom
        const flippedRow = 9 - row;  // Since we have 10 rows (0-9)
        return flippedRow * 10 + col + 1;
    }

    getCoordinates(position) {
        // Convert position to row and column (0-based)
        const row = 9 - Math.floor((position - 1) / 10); // Flip the row to start from bottom
        const col = (position - 1) % 10;
        
        // Calculate x and y coordinates
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        
        return {
            x: x + this.cellSize / 2,
            y: y + this.cellSize / 2
        };
    }

    randomizeSnakesAndLadders(count, startMin, startMax, endMin, endMax) {
        const result = {};
        const usedPositions = new Set();
        
        // Add position 1 to used positions to prevent snakes/ladders from touching it
        usedPositions.add(1);
        
        while (Object.keys(result).length < count) {
            const start = Math.floor(Math.random() * (startMax - startMin + 1)) + startMin;
            const end = Math.floor(Math.random() * (endMax - endMin + 1)) + endMin;
            
            // Calculate if the route is straight (same row or same column)
            const startRow = Math.floor((100 - start) / 10);
            const startCol = start % 10;
            const endRow = Math.floor((100 - end) / 10);
            const endCol = end % 10;
            const isStraightRoute = startRow === endRow || startCol === endCol;
            
            // Check if position is already used by snakes or ladders and not touching position 1
            if (!usedPositions.has(start) && !usedPositions.has(end) && start !== end && 
                start !== 1 && end !== 1 && // Prevent touching position 1
                Math.abs(start - end) > 1 && // Prevent very short snakes/ladders
                !isStraightRoute) { // Prevent straight routes
                result[start] = end;
                usedPositions.add(start);
                usedPositions.add(end);
            }
        }
        return result;
    }

    async rollDice() {
        if (this.isRolling) return;
        this.isRolling = true;

        const dice1 = document.getElementById('dice1');
        const dice2 = document.getElementById('dice2');
        const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        
        // Animate dice for 3 seconds
        const startTime = Date.now();
        while (Date.now() - startTime < 3000) {
            dice1.textContent = diceFaces[Math.floor(Math.random() * 6)];
            dice2.textContent = diceFaces[Math.floor(Math.random() * 6)];
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Set final values
        this.diceValues = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];
        dice1.textContent = diceFaces[this.diceValues[0] - 1];
        dice2.textContent = diceFaces[this.diceValues[1] - 1];

        const total = this.diceValues[0] + this.diceValues[1];
        document.getElementById('diceResult').textContent = `Dice: ${total}`;
        
        this.isRolling = false;
        this.movePlayer(total);
    }

    async movePlayer(steps) {
        const player = this.currentPlayer;
        const newPosition = Math.min(this.positions[player] + steps, 99);
        
        // Animate movement
        for (let pos = this.positions[player] + 1; pos <= newPosition; pos++) {
            this.positions[player] = pos;
            this.drawBoard();
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Check for special tiles
        if (this.specialTiles.includes(newPosition)) {
            const question = this.questions.star[Math.floor(Math.random() * this.questions.star.length)];
            const answer = await this.showQuestionDialog(question);
            
            if (answer === question.answer) {
                // Move forward 4 blocks
                const extraPosition = Math.min(newPosition + 4, 99);
                for (let pos = newPosition + 1; pos <= extraPosition; pos++) {
                    this.positions[player] = pos;
                    this.drawBoard();
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            } else {
                // Other player gets two turns
                this.currentPlayer = 1 - this.currentPlayer;
                document.getElementById('playerTurn').textContent = 
                    `Player ${this.currentPlayer + 1}'s turn (${this.players[this.currentPlayer]}) - Extra Turn!`;
                return;
            }
        }

        // Check for snakes
        if (this.snakes[newPosition]) {
            const question = this.questions.snake[Math.floor(Math.random() * this.questions.snake.length)];
            const answer = await this.showQuestionDialog(question);
            
            if (answer === question.answer) {
                // Stay safe at the snake's mouth
                alert("Correct! You avoided the snake!");
            } else {
                // Go down to the snake's tail
                alert("Wrong! Down the snake you go!");
                this.positions[player] = this.snakes[newPosition];
                this.drawBoard();
            }
        }
        
        // Check for ladders
        if (this.ladders[newPosition]) {
            const question = this.questions.ladder[Math.floor(Math.random() * this.questions.ladder.length)];
            const answer = await this.showQuestionDialog(question);
            
            if (answer === question.answer) {
                // Climb up the ladder
                alert("Correct! Up the ladder you go!");
                this.positions[player] = this.ladders[newPosition];
                this.drawBoard();
            } else {
                // Stay at the bottom
                alert("Wrong! You stay at the bottom of the ladder.");
            }
        }

        // Check for win
        if (this.positions[player] >= 99) {
            alert(`Player ${player + 1} (${this.players[player]}) wins!`);
            this.playFireworks();
            location.reload();
            return;
        }

        this.currentPlayer = 1 - this.currentPlayer;
        document.getElementById('playerTurn').textContent = 
            `Player ${this.currentPlayer + 1}'s turn (${this.players[this.currentPlayer]})`;
    }

    showQuestionDialog(question) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.style.position = 'fixed';
            dialog.style.top = '50%';
            dialog.style.left = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.style.backgroundColor = 'white';
            dialog.style.padding = '20px';
            dialog.style.border = '2px solid #333';
            dialog.style.borderRadius = '10px';
            dialog.style.zIndex = '1000';
            dialog.style.textAlign = 'center';
            dialog.style.fontFamily = 'Arial, sans-serif';
            
            const questionText = document.createElement('p');
            questionText.textContent = question.question;
            questionText.style.marginBottom = '20px';
            questionText.style.fontSize = '18px';
            dialog.appendChild(questionText);
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.gap = '20px';
            
            const correctButton = document.createElement('button');
            correctButton.textContent = 'Σωστό';
            correctButton.style.padding = '10px 20px';
            correctButton.style.fontSize = '16px';
            correctButton.style.cursor = 'pointer';
            correctButton.style.backgroundColor = '#4CAF50';
            correctButton.style.color = 'white';
            correctButton.style.border = 'none';
            correctButton.style.borderRadius = '5px';
            
            const wrongButton = document.createElement('button');
            wrongButton.textContent = 'Λάθος';
            wrongButton.style.padding = '10px 20px';
            wrongButton.style.fontSize = '16px';
            wrongButton.style.cursor = 'pointer';
            wrongButton.style.backgroundColor = '#f44336';
            wrongButton.style.color = 'white';
            wrongButton.style.border = 'none';
            wrongButton.style.borderRadius = '5px';
            
            correctButton.onclick = () => {
                document.body.removeChild(dialog);
                resolve('Σωστό');
            };
            
            wrongButton.onclick = () => {
                document.body.removeChild(dialog);
                resolve('Λάθος');
            };
            
            buttonContainer.appendChild(correctButton);
            buttonContainer.appendChild(wrongButton);
            dialog.appendChild(buttonContainer);
            
            document.body.appendChild(dialog);
        });
    }

    setupEventListeners() {
        document.getElementById('rollButton').addEventListener('click', () => {
            this.rollDice();
        });

        document.getElementById('randomizeButton').addEventListener('click', () => {
            // Reset player positions when randomizing
            this.positions = [1, 1]; // Start from position 1
            this.currentPlayer = 0;
            document.getElementById('playerTurn').textContent = 
                `Player ${this.currentPlayer + 1}'s turn (${this.players[this.currentPlayer]})`;
            
            // Randomize snakes and ladders with restrictions
            this.snakes = this.randomizeSnakesAndLadders(3, 20, 99, 2, 19); // Start from 2 to avoid position 1
            this.ladders = this.randomizeSnakesAndLadders(3, 2, 19, 20, 99); // Start from 2 to avoid position 1
            this.drawBoard();
        });

        document.getElementById('resetButton').addEventListener('click', () => {
            // Reset player positions
            this.positions = [1, 1];
            this.currentPlayer = 0;
            
            // Reset scores
            document.getElementById('score1').textContent = '0';
            document.getElementById('score2').textContent = '0';
            
            // Reset turn display
            document.getElementById('playerTurn').textContent = 
                `Player ${this.currentPlayer + 1}'s turn (${this.players[this.currentPlayer]})`;
            
            // Reset dice display
            document.getElementById('dice1').textContent = '⚀';
            document.getElementById('dice2').textContent = '⚀';
            document.getElementById('diceResult').textContent = 'Dice: 0';
            
            // Redraw the board
            this.drawBoard();
        });

        document.getElementById('dice1').addEventListener('click', () => {
            this.rollDice();
        });

        document.getElementById('dice2').addEventListener('click', () => {
            this.rollDice();
        });
    }

    // Helper functions for bezier curves
    bezierPoint(a, b, c, d, t) {
        return Math.pow(1-t, 3) * a + 
               3 * Math.pow(1-t, 2) * t * b + 
               3 * (1-t) * Math.pow(t, 2) * c + 
               Math.pow(t, 3) * d;
    }

    bezierTangent(a, b, c, d, t) {
        return -3 * Math.pow(1-t, 2) * a + 
               3 * Math.pow(1-t, 2) * b - 
               6 * t * (1-t) * b - 
               3 * Math.pow(t, 2) * c + 
               6 * t * (1-t) * c + 
               3 * Math.pow(t, 2) * d;
    }
}

// Start the game when the page loads
window.onload = () => {
    new SnakeAndLaddersGame();
}; 
