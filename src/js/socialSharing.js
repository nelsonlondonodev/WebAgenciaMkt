export function setupSocialSharing() {
  const shareLinkedin = document.getElementById('share-linkedin');
  const shareWhatsapp = document.getElementById('share-whatsapp');

  if (!shareLinkedin || !shareWhatsapp) return;

  const shareUrl = window.location.href;
  const shareTitle = document.title;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const shareText = descriptionMeta ? descriptionMeta.getAttribute('content') : '';

  if (shareUrl && shareTitle && shareText) {
    shareLinkedin.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(
      shareText
    )}`;
    shareLinkedin.target = '_blank';
    shareLinkedin.rel = 'noopener noreferrer';

    shareWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareTitle + ' - Link: ' + shareUrl
    )}`;
    shareWhatsapp.target = '_blank';
    shareWhatsapp.rel = 'noopener noreferrer';
  }
}
