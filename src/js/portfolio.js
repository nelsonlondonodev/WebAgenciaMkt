export function initPortfolio() {
  const filtersContainer = document.getElementById('portfolio-filters');
  const portfolioItems = document.querySelectorAll(
    '#portfolio-grid .portfolio-item'
  );
  if (filtersContainer && portfolioItems.length > 0) {
    filtersContainer.addEventListener('click', (e) => {
      if (e.target.matches('button.filter-btn')) {
        const clickedButton = e.target;
        if (clickedButton.classList.contains('active-filter')) {
          return;
        }
        filtersContainer
          .querySelector('.active-filter')
          .classList.remove('active-filter');
        clickedButton.classList.add('active-filter');
        const filterValue = clickedButton.dataset.filter;
        portfolioItems.forEach((item) => {
          const itemCategories = item.dataset.category;
          const matchesFilter =
            filterValue === 'all' || itemCategories.includes(filterValue);
          item.style.display = matchesFilter ? 'block' : 'none';
        });
      }
    });
  }
}
