// BlueChat Website - Main JavaScript with Modern Features

// Theme Toggle Functionality
function initializeThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;
  const body = document.body;
  
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('bluechat-theme') || 'light-mode';
  
  // Set initial theme
  if (savedTheme === 'dark-mode') {
    body.classList.add('dark-mode');
    if (themeToggle) {
      themeToggle.innerHTML = '<span class="theme-icon">☀️</span>';
    }
  }
  
  // Add click listener to theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const isDarkMode = body.classList.contains('dark-mode');
      
      // Save preference
      localStorage.setItem('bluechat-theme', isDarkMode ? 'dark-mode' : 'light-mode');
      
      // Update button icon
      themeToggle.innerHTML = isDarkMode 
        ? '<span class="theme-icon">☀️</span>' 
        : '<span class="theme-icon">🌙</span>';
    });
  }
}

// Active Navigation Highlight
document.addEventListener('DOMContentLoaded', () => {
  initializeThemeToggle();
  updateActiveNavLink();
  initializeStats();
  setupNotifyButtons();
});

function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize stats counter animation
function initializeStats() {
  const statCards = document.querySelectorAll('.stat-card h3');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        animateCounter(entry.target);
        entry.target.dataset.animated = 'true';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statCards.forEach(card => observer.observe(card));
}

function animateCounter(element) {
  const text = element.textContent;
  const match = text.match(/(\d+)/);
  
  if (match) {
    const finalNumber = parseInt(match[1]);
    const duration = 1500;
    const steps = 60;
    const increment = finalNumber / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= finalNumber) {
        element.textContent = text;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + text.replace(/\d+/, '');
      }
    }, duration / steps);
  }
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Feedback Form Handling with Web App Integration
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', e => {
    e.preventDefault();

    // Collect form data from FormData
    const formData = Object.fromEntries(
      new FormData(e.target).entries()
    );

    // Log the data (for debugging)
    console.log('Form Data:', formData);

    // Send data to Google Apps Script Web App URL
    // Replace 'WEB_APP_URL' with your actual Google Apps Script deployment URL
    const WEB_APP_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercallback'; // Replace with actual URL

    fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(formData),
      mode: 'no-cors'
    })
    .then(() => {
      console.log('Data saved successfully');
      showThankYouPage();
    })
    .catch(error => {
      console.error('Error:', error);
      // Still show thank you page even if there's a network issue
      showThankYouPage();
    });
  });
}

function showThankYouPage() {
  const successMsg = document.getElementById('successMessage');
  const form = document.querySelector('.feedback-form');
  
  if (successMsg && form) {
    successMsg.style.display = 'block';
    form.style.display = 'none';
    
    // Smooth scroll to success message
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Lazy Loading Images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Scroll Animation for Cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'slideUp 0.6s ease forwards';
      cardObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.version-card, .upcoming-card, .about-card, .feature-item, .stat-card').forEach(card => {
  card.style.opacity = '0';
  cardObserver.observe(card);
});

// Mobile Menu Toggle
function setupMobileMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

setupMobileMenu();

// Add animation class on page load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Notify button handler
function setupNotifyButtons() {
  const notifyButtons = document.querySelectorAll('.notify-btn');
  notifyButtons.forEach(btn => {
    if (!btn.hasAttribute('onclick')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showNotifyModal();
      });
    }
  });
}

function showNotifyModal() {
  const email = prompt('Enter your email to get notified when the feature is ready:');
  if (email && email.includes('@')) {
    alert('Thank you! You\'ll be notified at ' + email);
  } else if (email) {
    alert('Please enter a valid email address');
  }
}

// Scroll to top button
function createScrollToTopButton() {
  const button = document.createElement('button');
  button.innerHTML = '⬆️';
  button.className = 'scroll-to-top';
  
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.style.display = 'flex';
    } else {
      button.style.display = 'none';
    }
  });
  
  button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.1)';
  });
  
  button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1)';
  });
  
  document.body.appendChild(button);
}

createScrollToTopButton();

// Add loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

console.log('✅ BlueChat Website Loaded Successfully! 🚀');
console.log('📱 Modern Bluetooth-Themed Design with Dark Mode');
console.log('🌙 Theme Toggle: Available in Navigation Bar');
