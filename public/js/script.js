const toggleMenu = () => {
  const menuBars = document.getElementById('menu-bars');
  const navElement = document.querySelector('nav');

  const toggleNav = () => {
    menuBars.classList.toggle('change');
    navElement.classList.toggle('open');
    const menuLinks = document.querySelector('.menuLinks');
    menuLinks.classList.toggle('open');
  };

  // Event Listener
  menuBars.addEventListener('click', toggleNav);
};

toggleMenu();
