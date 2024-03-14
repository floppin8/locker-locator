document.addEventListener('DOMContentLoaded', function() {
  // Initialization functions
  setupZoomAndHighlights();
  
  // Event listeners
  document.getElementById('categorySelect').addEventListener('change', handleCategoryChange);
  document.getElementById('personalInfoBtn').addEventListener('click', function() {
    document.getElementById('saveChangesBtn').style.display = 'block';
  });
});

function handleCategoryChange() {
  const category = document.getElementById('categorySelect').value;
  const lockerInput = document.getElementById('lockerNumberInput');
  lockerInput.style.display = category === 'Locker' ? 'block' : 'none';
  highlightCategory(category);
}

function highlightCategory(category) {
  const highlightedAreas = document.getElementById("highlightedAreas");
  highlightedAreas.innerHTML = ""; // Clear previous highlights
  
  if (categoryPositions[category]) {
    categoryPositions[category].forEach(pos => {
      const highlightArea = document.createElement("div");
      highlightArea.classList.add("highlight-area");
      highlightArea.style.position = "absolute";
      highlightArea.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      highlightArea.dataset.originalTop = pos.top;
      highlightArea.dataset.originalLeft = pos.left;
      highlightArea.dataset.originalWidth = pos.width;
      highlightArea.dataset.originalHeight = pos.height;
      highlightedAreas.appendChild(highlightArea);
      // Initial placement without zoom
      placeHighlight(highlightArea, 1);
    });
  }
}

function setupZoomAndHighlights() {
  const container = document.getElementById('zoomContainer');
  const img = document.getElementById('mapImage');
  let scale = 1;
  
  container.addEventListener('wheel', function(e) {
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left; // Mouse X relative to the container
    const offsetY = e.clientY - rect.top; // Mouse Y relative to the container
    
    const delta = e.deltaY * -0.02; // Adjust zoom speed
    const newScale = Math.max(scale + delta, 1); // Prevent zooming out beyond original size
    
    adjustZoom(newScale, offsetX, offsetY);
  });
  
  container.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      touchCenter = getCenterPoint(e.touches, container);
    }
  });
  
  container.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
      const newCenter = getCenterPoint(e.touches, container);
      const currentDistance = getDistanceBetweenTouches(e.touches);
      if (lastTouchDistance !== 0) {
        const deltaScale = currentDistance / lastTouchDistance;
        const newScale = Math.max(scale * deltaScale, 1); // Prevent zooming out beyond original size
        adjustZoom(newScale, newCenter.x, newCenter.y);
        lastTouchDistance = currentDistance;
      }
      e.preventDefault();
    }
  });
  
  container.addEventListener('touchend', function(e) {
    lastTouchDistance = 0; // Reset after pinch-to-zoom gesture ends
  });
  
  function adjustZoom(newScale, originX, originY) {
    scale = newScale;
    // Convert origin points to percentages
    const originXPercent = (originX / container.offsetWidth) * 100;
    const originYPercent = (originY / container.offsetHeight) * 100;
    img.style.transformOrigin = `${originXPercent}% ${originYPercent}%`;
    img.style.transform = `scale(${scale})`;
    document.querySelectorAll('.highlight-area').forEach(highlight => {
      placeHighlight(highlight, scale);
    });
  }
  
  
  function getDistanceBetweenTouches(touches) {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  function getCenterPoint(touches) {
    return {
      x: (touches[0].pageX + touches[1].pageX) / 2,
      y: (touches[0].pageY + touches[1].pageY) / 2,
    };
  }
}
function getCenterPoint(touches, container) {
  const rect = container.getBoundingClientRect();
  const x = (touches[0].pageX + touches[1].pageX) / 2 - rect.left;
  const y = (touches[0].pageY + touches[1].pageY) / 2 - rect.top;
  return { x, y };
}

function placeHighlight(highlight, scale) {
  const originalTop = parseInt(highlight.dataset.originalTop, 10);
  const originalLeft = parseInt(highlight.dataset.originalLeft, 10);
  const originalWidth = parseInt(highlight.dataset.originalWidth, 10);
  const originalHeight = parseInt(highlight.dataset.originalHeight, 10);
  
  highlight.style.top = `${originalTop * scale}px`;
  highlight.style.right = `${originalLeft * scale}px`;
  highlight.style.width = `${originalWidth * scale}px`;
  highlight.style.height = `${originalHeight * scale}px`;
}
const categoryPositions = {
  Restrooms: [
    { top: 50, left: 150, width: 100, height: 100 },
    { top: 300, left: 250, width: 100, height: 100 }
  ],
  'Attendance Office': [
    { top: 200, left: 350, width: 120, height: 120 }
  ],
  // Define other categories as needed
};
