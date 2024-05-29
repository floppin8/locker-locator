class MVHSDirectory {
    constructor() {
        this.zoomContainer = document.getElementById('zoomContainer');
        this.highlightedAreas = document.getElementById("highlightedAreas");
        this.categorySelect = document.getElementById('categorySelect');
        this.lockerNumber = document.getElementById('lockerNumber');
        this.classroomNumber = document.getElementById('classroomNumber');
        this.mapPointsList = document.getElementById('mapPointsList');
        this.points = JSON.parse(localStorage.getItem('mapPoints')) || [];
    }
    
    init() {
        this.attachEventListeners();
        this.displayPoints();
    }
    
    
    attachEventListeners() {
        if (this.lockerNumber) {
            this.lockerNumber.addEventListener('input', () => this.updateHighlights('locker'));
        }
        if (this.classroomNumber) {
            this.classroomNumber.addEventListener('input', () => this.updateHighlights('classroom'));
        }
        this.categorySelect.addEventListener('change', () => this.updateHighlights('category'));
        window.addEventListener('resize', () => this.clearHighlights());
        
        // Event listeners for map points
        this.zoomContainer.addEventListener('click', (event) => this.handleMapClick(event));
        document.getElementById('saveMapPointsBtn').addEventListener('click', () => this.savePoints());
        document.getElementById('clearMapPointsBtn').addEventListener('click', () => this.clearPoints());
    }
    handleMapClick(event) {
        const rect = this.zoomContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.addPoint(x, y);
    }
    
    
    isNear(point1, point2, threshold = 10) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy) < threshold;
    }
    
    
    deletePoint(point) {
        this.points = this.points.filter(p => p !== point);
        this.displayPoints(); // Refresh the display
    }
    
    addPoint(x, y) {
        const existingPoint = this.points.find(point => this.isNear(point, { x, y }));
        if (existingPoint) {
            this.deletePoint(existingPoint);
        } else {
            const point = { x, y };
            this.points.push(point);
            this.displayPoints();
        }
    }
    
    displayPoints() {
        this.zoomContainer.querySelectorAll('.point').forEach(pointDiv => pointDiv.remove()); // Clear existing points
        this.points.forEach(point => this.displayPoint(point));
    }
    
    displayPoint(point) {
        const pointDiv = document.createElement('div');
        pointDiv.className = 'point';
        pointDiv.style.left = `${point.x}px`;
        pointDiv.style.top = `${point.y}px`;
        pointDiv.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent map click from adding a new point
            this.deletePoint(point);
        });
        this.zoomContainer.appendChild(pointDiv);
    }
    
    clearPoints() {
        if (confirm('Are you sure you want to clear all points?')) {
            this.points = [];
            this.displayPoints();
            localStorage.removeItem('mapPoints');
        }
    }
    
    
    savePoints() {
        localStorage.setItem('mapPoints', JSON.stringify(this.points));
        alert('Points saved!');
    }
    
    
    updateHighlights(type) {
        this.clearHighlights();
        let num, coordinates;
        if (type === 'locker') {
            num = this.lockerNumber.value.trim();
            coordinates = this.getLockerCoordinates(num);
        } else if (type === 'classroom') {
            num = this.classroomNumber.value.trim();
            coordinates = this.getClassroomCoordinates(num);
        } else if (type === 'category') {
            const category = this.categorySelect.value;
            this.highlightCategory(category);
            return;
        }
        if (coordinates) {
            const imageWidth = this.zoomContainer.offsetWidth;
            const imageHeight = this.zoomContainer.offsetHeight;
            const scaledCoordinates = {
                top: (coordinates.top / 590.766) * imageHeight,
                left: (coordinates.left / 848) * imageWidth,
                width: (coordinates.width / 848) * imageWidth,
                height: (coordinates.height / 590.766) * imageHeight
            };
            this.createHighlightArea(scaledCoordinates);
        }
    }
    
    getClassroomCoordinates(num) {
        const map = {
            '101': { top: 100, left: 200, width: 30, height: 30 },
            '102': { top: 140, left: 250, width: 30, height: 30 },
            // Add more as needed
        };
        return map[num];
    }
    
    getLockerCoordinates(num) {
        num = parseInt(num, 10);
        if (isNaN(num)) return null;
        const ranges = [
            { range: [1, 240], pos: { top: 280, left: 247, width: 10, height: 85 } },
            { range: [241, 334], pos: { top: 258, left: 202, width: 10, height: 50 } },
            { range: [335, 705], pos: { top: 280, left: 300, width: 10, height: 85 } },
            { range: [706, 789], pos: { top: 250, left: 318, width: 28, height: 10 } },
            { range: [790, 873], pos: { top: 250, left: 211, width: 28, height: 10 } }
        ];
        return ranges.find(r => num >= r.range[0] && num <= r.range[1])?.pos;
    }
    
    highlightCategory(category) {
        const positions = {
            'Restrooms': [{ top: 185, left: 290, width: 8, height: 21 }, { top: 191, left: 395, width: 10, height: 15 }, 
                { top: 309, left: 96, width: 18, height: 10 }, { top: 345, left: 130, width: 18, height: 10 },
                { top: 404, left: 164, width: 29, height: 9 }, { top: 389, left: 530, width: 17, height: 10 },
                { top: 517, left: 508, width: 22, height: 8 },], 
                'Attendance Office': [{ top: 440, left: 165, width: 25, height: 23 }],
                'Parking Lots': [{ top: 140, left: 90, width: 100, height: 80 }, { top: 485, left: 60, width: 175, height: 55 },],
                'Textbook Center': [{ top: 413, left: 342, width: 13, height: 30 }],
                // Add other categories here
            }[category];
            if (positions) {
                const imageWidth = this.zoomContainer.offsetWidth;
                const imageHeight = this.zoomContainer.offsetHeight;
                positions.forEach(pos => {
                    const scaledPos = {
                        top: (pos.top / 590.766) * imageHeight,
                        left: (pos.left / 848) * imageWidth,
                        width: (pos.width / 848) * imageWidth,
                        height: (pos.height / 590.766) * imageHeight
                    };
                    this.createHighlightArea(scaledPos);
                });
            }
        }
        
        
        createHighlightArea(pos) {
            const area = document.createElement("div");
            area.className = "highlight-area";
            Object.assign(area.style, {
                position: "absolute", backgroundColor: "rgba(255, 0, 0, 0.5)",
                top: `${pos.top}px`, left: `${pos.left}px`,
                width: `${pos.width}px`, height: `${pos.height}px`
            });
            this.highlightedAreas.appendChild(area);
        }
        
        clearHighlights() {
            this.highlightedAreas.innerHTML = "";
        }
    }