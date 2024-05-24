document.addEventListener('DOMContentLoaded', function() {
  const directory = new MVHSDirectory();
  directory.init();
});

class LockerLocator {
  constructor() {
    this.zoomContainer = document.getElementById('zoomContainer');
    this.mapImage = document.getElementById('mapImage');
    this.categorySelect = document.getElementById('categorySelect');
    this.classroomNumber = document.getElementById('classroomNumber');
    this.lockerNumber = document.getElementById('lockerNumber');
    this.highlightedAreas = document.getElementById("highlightedAreas");
    this.highlightLockerToggle = document.getElementById("highlightLockerToggle");
    this.highlightClassToggle = document.getElementById("highlightClassToggle");
    this.scale = 1;
    this.lastTouchDistance = 0;
      
      //map point stuff
      this.zoomContainer = document.getElementById('zoomContainer');
      this.mapImage = document.getElementById('mapImage');
      this.mapPointsList = document.getElementById('mapPointsList');
      this.points = JSON.parse(localStorage.getItem('mapPoints')) || [];
    }
    
    init() {
      this.attachEventListeners();
      this.loadLockerInfo();
      this.displayPoints();
    }
    
    attachEventListeners() {
      this.zoomContainer.addEventListener('wheel', this.handleZoom.bind(this));
      this.zoomContainer.addEventListener('touchstart', this.handleTouchStart.bind(this), {passive: false});
      this.zoomContainer.addEventListener('touchmove', this.handleTouchMove.bind(this), {passive: false});
      this.zoomContainer.addEventListener('touchend', this.resetTouch.bind(this));
      this.categorySelect.addEventListener('change', this.handleCategoryChange.bind(this));
      this.classroomNumber.addEventListener('input', this.updateClassroomHighlight.bind(this));
      this.lockerNumber.addEventListener('input', this.updateLockerHighlight.bind(this));
  
      this.lockerCombo.addEventListener('input', this.saveLockerInfo.bind(this));
      this.highlightLockerToggle.addEventListener('click', this.highlightLocker.bind(this));
      this.highlightClassToggle.addEventListener('click', this.highlightClass.bind(this));
      
      this.zoomContainer.addEventListener('click', this.handleMapClick.bind(this));
      document.getElementById('saveMapPointsBtn').addEventListener('click', this.savePoints.bind(this));
      document.getElementById('clearMapPointsBtn').addEventListener('click', this.clearPoints.bind(this));
      
    }
    
    //point stuff
    handleMapClick(event) {
      const rect = this.zoomContainer.getBoundingClientRect();
      const x = event.clientX ;
      const y = event.clientY;
      this.addPoint(x, y);
    }
    
    addPoint(x, y) {
      const point = { x, y };
      this.points.push(point);
      this.displayPoint(point);
    }
    
    displayPoints() {
      this.mapPointsList.innerHTML = ''; // Clear existing points
      this.points.forEach(point => this.displayPoint(point));
    }
    
    displayPoint(point) {
      const pointDiv = document.createElement('div');
      pointDiv.className = 'point';
      pointDiv.style.left = `${point.x}px`;
      pointDiv.style.top = `${point.y}px`;
      pointDiv.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the map from adding a new point when a point is removed
        this.deletePoint(point);
      });
      this.mapPointsList.appendChild(pointDiv);
    }
    
    deletePoint(point) {
      this.points = this.points.filter(p => p !== point);
      this.displayPoints(); // Refresh the display
    }
    
    savePoints() {
      localStorage.setItem('mapPoints', JSON.stringify(this.points));
      alert('Points saved!');
    }
    
    clearPoints() {
      this.points = [];
      this.displayPoints();
      localStorage.removeItem('mapPoints');
    }
  
  handleZoom(event) {
    /*
    event.preventDefault();
    const rect = this.zoomContainer.getBoundingClientRect();
    const offsetX = event.clientX - rect.left; // Mouse X relative to the container
    const offsetY = event.clientY - rect.top; // Mouse Y relative to the container
    
    const delta = event.deltaY * -0.01; // Adjust zoom speed
    const newScale = Math.max(this.scale + delta, 1); // Prevent zooming out beyond original size
    
    this.adjustZoom(newScale, offsetX, offsetY);
    */
  }
  
  handleTouchStart(event) {
    if (event.touches.length === 2) {
      event.preventDefault();
      this.lastTouchDistance = this.getDistanceBetweenTouches(event.touches);
    }
  }
  
  handleTouchMove(event) {
    if (event.touches.length === 2) {
      event.preventDefault();
      const newTouchDistance = this.getDistanceBetweenTouches(event.touches);
      const scaleChange = newTouchDistance / this.lastTouchDistance;
      const newScale = Math.max(this.scale * scaleChange, 1); // Prevent zooming out beyond original size
      
      const rect = this.zoomContainer.getBoundingClientRect();
      const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2 - rect.left;
      const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2 - rect.top;
      
      this.adjustZoom(newScale, centerX, centerY);
      this.lastTouchDistance = newTouchDistance;
    }
  }
  
  resetTouch() {
    this.lastTouchDistance = 0; // Reset after pinch-to-zoom gesture ends
  }
  
  adjustZoom(newScale, originX, originY) {
    this.scale = newScale;
    // Convert origin points to percentages for 'transform-origin' property
    const originXPercent = (originX / this.zoomContainer.offsetWidth) * 100;
    const originYPercent = (originY / this.zoomContainer.offsetHeight) * 100;
    
    this.mapImage.style.transformOrigin = `${originXPercent}% ${originYPercent}%`;
    this.mapImage.style.transform = `scale(${this.scale})`;
  }
  
  getDistanceBetweenTouches(touches) {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  saveLockerInfo() {
    console.log("Saving Locker Info", this.lockerNumber.value, this.lockerCombo.value); // Debug log
    localStorage.setItem('lockerNumber', this.lockerNumber.value);
    localStorage.setItem('lockerCombo', this.lockerCombo.value);
  }
  
  
  loadLockerInfo() {
    this.lockerNumber.value = localStorage.getItem('lockerNumber') || '';
    this.lockerCombo.value = localStorage.getItem('lockerCombo') || '';
  }
}




document.addEventListener('DOMContentLoaded', function() {
  const directory = new MVHSDirectory();
  directory.init();
});

