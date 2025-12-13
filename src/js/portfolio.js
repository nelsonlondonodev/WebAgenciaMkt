export function initPortfolioFilter() {
  const filtersContainer = document.getElementById('portfolio-filters');
  const portfolioGrid = document.getElementById('portfolio-grid');

  if (!filtersContainer || !portfolioGrid) return;

  const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item');
  if (portfolioItems.length === 0) return;

  filtersContainer.addEventListener('click', (e) => {
    const clickedButton = e.target.closest('button.filter-btn');
    if (!clickedButton) return;

    if (clickedButton.classList.contains('active-filter')) {
      return;
    }

    const currentActive = filtersContainer.querySelector('.active-filter');
    if (currentActive) {
      currentActive.classList.remove('active-filter');
    }
    clickedButton.classList.add('active-filter');

    const filterValue = clickedButton.dataset.filter;

    portfolioItems.forEach((item) => {
      const itemCategories = item.dataset.category || '';
      const matchesFilter =
        filterValue === 'all' || itemCategories.includes(filterValue);

      if (matchesFilter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
}
