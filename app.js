document.addEventListener('DOMContentLoaded', displayEvents);
const eventForm = document.getElementById('eventForm');
const eventList = document.getElementById('eventList');

// A collection of whimsical, nostalgic nature photos for event thumbnails
const aestheticImages = [
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80"
];

eventForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('eventName').value;
  const date = document.getElementById('eventDate').value;
  const location = document.getElementById('eventLocation').value;
  
  // Pick a random image for the event card
  const randomImg = aestheticImages[Math.floor(Math.random() * aestheticImages.length)];
  
  const newEvent = {
    id: Date.now(),
    name: name,
    date: date,
    location: location,
    image: randomImg
  };
  
  let events = getEvents();
  events.unshift(newEvent); // Adds newest events to the beginning
  localStorage.setItem('events', JSON.stringify(events));
  
  eventForm.reset();
  displayEvents();
});

function getEvents() {
  let events = localStorage.getItem('events');
  return events === null ? [] : JSON.parse(events);
}

function displayEvents() {
  const events = getEvents();
  eventList.innerHTML = '';
  
  if (events.length === 0) {
    eventList.innerHTML = `
      <div class="col-span-1 sm:col-span-2 text-center py-12 glass-panel rounded-2xl slide-up text-white">
        <h3 class="text-xl font-serif mb-2">No events found</h3>
        <p class="font-sans font-light">Your journey begins when you add your first event.</p>
      </div>`;
    return;
  }
  
  events.forEach((event, index) => {
    // Staggered animation delay for a cool visual effect when loading
    const delay = index * 0.1;
    
    const eventCard = document.createElement('div');
    eventCard.classList.add('glass-card', 'rounded-2xl', 'overflow-hidden', 'flex', 'flex-col');
    eventCard.style.animation = `slideUp 0.6s ease-out ${delay}s both`;
    
    // Format the date to look nicer
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    eventCard.innerHTML = `
      <div class="h-40 w-full overflow-hidden">
        <img src="${event.image}" alt="${event.name}" class="w-full h-full object-cover transition duration-500 hover:scale-110">
      </div>
      <div class="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-bold font-serif text-gray-900 mb-1">${event.name}</h3>
          <p class="text-sm text-emerald-700 font-semibold mb-3">📍 ${event.location}</p>
        </div>
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200/50">
          <span class="text-xs text-gray-600 font-medium">📅 ${formattedDate}</span>
          <button onclick="deleteEvent(${event.id})" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition" title="Cancel Event">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    `;
    eventList.appendChild(eventCard);
  });
}

function deleteEvent(id) {
  let events = getEvents();
  events = events.filter(event => event.id !== id);
  localStorage.setItem('events', JSON.stringify(events));
  displayEvents();
}