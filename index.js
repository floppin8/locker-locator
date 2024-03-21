document.addEventListener('DOMContentLoaded', function() {
  const lockerLocator = new LockerLocator();
  lockerLocator.init();
});

class LockerLocator {
  constructor() {
    this.zoomContainer = document.getElementById('zoomContainer');
    this.mapImage = document.getElementById('mapImage');
    this.categorySelect = document.getElementById('categorySelect');
    this.lockerNumber = document.getElementById('lockerNumber');
    this.lockerCombo = document.getElementById('lockerCombo');
    this.highlightedAreas = document.getElementById("highlightedAreas");
    this.highlightLockerToggle = document.getElementById("highlightLockerToggle");
    this.scale = 1;
    this.lastTouchDistance = 0;
    this.categoryPositions = {
      Restrooms: [{ top: 50, left: 150, width: 100, height: 100 }, { top: 300, left: 250, width: 100, height: 100 }],
      'Attendance Office': [{ top: 200, left: 350, width: 120, height: 120 }],
      // Add other categories as needed
    };
  }

  init() {
    this.attachEventListeners();
    this.loadLockerInfo();
  }

  attachEventListeners() {
    this.zoomContainer.addEventListener('wheel', this.handleZoom.bind(this));
    this.zoomContainer.addEventListener('touchstart', this.handleTouchStart.bind(this), {passive: false});
    this.zoomContainer.addEventListener('touchmove', this.handleTouchMove.bind(this), {passive: false});
    this.zoomContainer.addEventListener('touchend', this.resetTouch.bind(this));
    this.categorySelect.addEventListener('change', this.handleCategoryChange.bind(this));
    this.lockerNumber.addEventListener('input', this.saveLockerInfo.bind(this));
    this.lockerCombo.addEventListener('input', this.saveLockerInfo.bind(this));
    this.highlightLockerToggle.addEventListener('click', this.highlightLocker.bind(this));
  }

  handleCategoryChange() {
    const selectedCategory = this.categorySelect.value;
    this.highlightCategory(selectedCategory);
  }

  highlightLocker() {
    const lockerNumber = this.lockerNumber.value;
    const highlightLockerToggle = this.highlightLockerToggle;
    if (lockerNumber && highlightLockerToggle.checked) {
      if ((lockerNumber >= 1 && lockerNumber <= 240) || (lockerNumber >= 956 && lockerNumber <= 1126)) {
        this.createHighlightArea({ top: 280, left: 247, width: 10, height: 85 });
      }
      if ((lockerNumber >= 241 && lockerNumber <= 334) || (lockerNumber >= 874 && lockerNumber <= 955)) {
        this.createHighlightArea({ top: 258, left: 202, width: 10, height: 50 });
      }
      if (lockerNumber >= 335 && lockerNumber <= 705) {
        this.createHighlightArea({ top: 280, left: 300, width: 10, height: 85 });
      }
      if (lockerNumber >= 706 && lockerNumber <= 789) {
        this.createHighlightArea({ top: 250, left: 318, width: 28, height: 10 });
      }
    } else {
      this.highlightedAreas.innerHTML = ""; // Clear previous highlights
    }
  }

  highlightCategory(category) {
    this.highlightedAreas.innerHTML = ""; // Clear previous highlights
    if (this.categoryPositions[category]) {
      this.categoryPositions[category].forEach(pos => this.createHighlightArea(pos));
    }
  }

  createHighlightArea(pos) {
    const highlightArea = document.createElement("div");
    highlightArea.classList.add("highlight-area");
    highlightArea.style.position = "absolute";
    highlightArea.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
    Object.assign(highlightArea.style, {
      top: `${pos.top}px`, 
      left: `${pos.left}px`, 
      width: `${pos.width}px`, 
      height: `${pos.height}px`
    });
    this.highlightedAreas.appendChild(highlightArea);
  }

  handleZoom(event) {
    event.preventDefault();
    const rect = this.zoomContainer.getBoundingClientRect();
    const offsetX = event.clientX - rect.left; // Mouse X relative to the container
    const offsetY = event.clientY - rect.top; // Mouse Y relative to the container

    const delta = event.deltaY * -0.01; // Adjust zoom speed
    const newScale = Math.max(this.scale + delta, 1); // Prevent zooming out beyond original size

    this.adjustZoom(newScale, offsetX, offsetY);
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
