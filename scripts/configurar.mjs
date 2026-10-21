import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await fs.readFile(path.join(root, 'site.config.json'), 'utf8'));
const production = config.mode === 'production';
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const jsonSafe = (data) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
function checkUrl(value, label, allowedHosts = []) {
  if (!value) return '';
  let url;
  try { url = new URL(value); } catch { throw new Error(label + ': informe uma URL HTTPS completa.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new Error(label + ': use HTTPS, sem credenciais, parâmetros ou fragmentos.');
  if (allowedHosts.length && !allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith('.' + host))) throw new Error(label + ': domínio inesperado.');
  return url.href;
}
if (!['mock', 'production'].includes(config.mode)) throw new Error('mode deve ser mock ou production.');
if (!/^55\d{10,11}$/.test(config.whatsapp)) throw new Error('WhatsApp inválido. Use DDI 55 + DDD + número.');
let siteUrl = checkUrl(config.siteUrl, 'siteUrl');
if (siteUrl && !siteUrl.endsWith('/')) siteUrl += '/';
const social = {
  instagram: checkUrl(config.social?.instagram, 'Instagram', ['instagram.com']),
  tiktok: checkUrl(config.social?.tiktok, 'TikTok', ['tiktok.com']),
  facebook: checkUrl(config.social?.facebook, 'Facebook', ['facebook.com'])
};
// Maps costuma ter parâmetros de busca: são aceitos apenas para URLs do provedor.
let maps = '';
if (config.mapsUrl) {
  const url = new URL(config.mapsUrl);
  if (url.protocol !== 'https:' || url.username || url.password || !['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl'].includes(url.hostname)) throw new Error('mapsUrl deve ser um link oficial HTTPS do Google Maps.');
  maps = url.href;
}
if (config.analytics?.enabled && !/^G-[A-Z0-9]+$/.test(config.analytics.measurementId || '')) throw new Error('Informe o ID GA4 real no formato G-XXXXXXXXXX.');
if (production) {
  if (!siteUrl) throw new Error('Produção exige siteUrl real, sem adivinhar domínio ou usuário do GitHub.');
  const required = ['contentApproved', 'hostingTermsReviewed', 'privacyReviewed', 'realPortfolioConfirmed'];
  for (const field of required) if (!config.publication?.[field]) throw new Error('Antes de publicar, confirme publication.' + field + ' no site.config.json.');
  if (!config.address?.streetAddress || !config.address?.postalCode) throw new Error('Produção exige endereço completo e CEP confirmados para SEO local.');
  if (!Object.values(social).some(Boolean)) throw new Error('Produção exige ao menos um perfil social oficial.');
}
const whatsapp = 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent('Olá, Santos Lavação! Quero orientação para cuidar do meu veículo. Podem me informar valores, condições e disponibilidade?');
const fallbackMaps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Peçaville Costa e Silva Joinville SC');
const postalKeys = ['streetAddress', 'postalCode', 'addressLocality', 'addressRegion', 'addressCountry'];
const postal = Object.fromEntries(postalKeys.filter((key) => config.address?.[key]).map((key) => [key, config.address[key]]));
const neighborhood = config.address?.neighborhood || '';
const placeQuery = [postal.streetAddress, neighborhood, postal.addressLocality, postal.addressRegion, postal.postalCode].filter(Boolean).join(', ');
const directions = postal.streetAddress && postal.postalCode ? 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(placeQuery) : '';
const mapEmbed = postal.streetAddress && postal.postalCode ? 'https://maps.google.com/maps?q=' + encodeURIComponent(placeQuery) + '&hl=pt-BR&z=17&output=embed' : '';
const routeUrl = maps || directions;
if (production && !routeUrl) throw new Error('Produção exige o link exato do Google Maps ou o endereço completo.');
const located = Boolean(postal.streetAddress && postal.postalCode);
const schema = {
  '@context': 'https://schema.org', '@type': 'CarWash', name: 'Santos Lavação',
  description: located
    ? 'Lavação automotiva na ' + postal.streetAddress + ', ' + (neighborhood || 'Costa e Silva') + ', Joinville/SC. Acesso pelos fundos da Peçaville.'
    : 'Lavação automotiva para motos, carros, SUVs e camionetes no Costa e Silva, Joinville/SC, nos fundos da Peçaville.',
  telephone: '+' + config.whatsapp,
  address: { '@type': 'PostalAddress', ...postal },
  areaServed: { '@type': 'Place', name: (neighborhood || 'Costa e Silva') + ', Joinville/SC' }
};
if (siteUrl) {
  schema.url = siteUrl;
  schema['@id'] = siteUrl + '#santos-lavacao';
  schema.logo = new URL('assets/logo.png', siteUrl).href;
}
if (Object.values(social).some(Boolean)) schema.sameAs = Object.values(social).filter(Boolean);
if (routeUrl) schema.hasMap = routeUrl;
if (config.openingHoursSpecification?.length) schema.openingHoursSpecification = config.openingHoursSpecification;
let urlMeta = '';
if (siteUrl) {
  const image = new URL('assets/social-card.png', siteUrl).href;
  urlMeta = `<link rel="canonical" href="${esc(siteUrl)}">\n  <meta property="og:url" content="${esc(siteUrl)}">\n  <meta property="og:image" content="${esc(image)}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="Santos Lavação — lavação automotiva no Costa e Silva, Joinville">\n  <meta name="twitter:image" content="${esc(image)}">`;
}
const channels = [{ key: 'instagram', title: 'Instagram', text: 'Serviços e registros de antes e depois.' }, { key: 'tiktok', title: 'TikTok', text: 'Vídeos do atendimento.' }];
if (social.facebook) channels.push({ key: 'facebook', title: 'Facebook', text: 'Página da Santos Lavação no Facebook.' });
const socialCards = channels.map(({ key, title, text }) => {
  const url = social[key];
  const start = url ? `<a class="social-card" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-event="click_social" data-channel="${key}" data-position="redes">` : `<button type="button" class="social-card" data-pending="${key}" aria-label="${title}: perfil oficial será publicado">`;
  return `${start}<svg aria-hidden="true"><use href="#i-${key}"></use></svg><span class="social-copy"><strong>${title}</strong><small>${url ? esc(text) : 'Perfil oficial será publicado'}</small></span><svg aria-hidden="true"><use href="#i-arrow"></use></svg>${url ? '</a>' : '</button>'}`;
}).join('\n');
const values = {
  ROBOTS: production ? 'index, follow, max-image-preview:large' : 'noindex, follow',
  URL_META: urlMeta,
  VERIFICATION: config.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(config.googleSiteVerification)}">` : '',
  SCHEMA: jsonSafe(schema), WHATSAPP: esc(whatsapp), SOCIAL_CARDS: socialCards,
  SOCIAL_NOTE_HIDDEN: channels.every(({ key }) => social[key]) ? 'hidden' : '',
  META_DESCRIPTION: esc(located
    ? 'Lavação na ' + postal.streetAddress + ', ' + (neighborhood || 'Costa e Silva') + ', Joinville/SC. Acesso pelos fundos da Peçaville. WhatsApp (47) 9 8885-4331.'
    : 'Lavação de motos, carros, SUVs e camionetes no Costa e Silva, Joinville. Serviços da Santos Lavação, nos fundos da Peçaville.'),
  HERO_PLACE: located
    ? '<strong>' + esc(postal.streetAddress) + '</strong><span>' + esc(neighborhood || 'Costa e Silva') + ' · fundos da Peçaville</span>'
    : 'Nos fundos da <strong>Peçaville</strong><span>Lavação automotiva no Costa e Silva</span>',
  LOCATION_INTRO: located
    ? 'A Santos Lavação fica na <strong>' + esc(postal.streetAddress) + '</strong>, ' + esc(neighborhood) + ', CEP ' + esc(postal.postalCode) + ', ' + esc(postal.addressLocality) + '/' + esc(postal.addressRegion) + '. O acesso é pelos fundos da <strong>Auto Peças Mecânica e Borracharia Peçaville</strong>.'
    : 'A Santos Lavação fica nos fundos da <strong>Auto Peças Mecânica e Borracharia Peçaville</strong>, em Joinville/SC.',
  LOCATION_TITLE: located ? esc(postal.streetAddress.split(',')[0]) + ',<br>nº ' + esc((postal.streetAddress.split(',')[1] || '').replace(/\D/g, '')) + '.' : 'Nos fundos<br>da Peçaville.',
  LOCATION_LINE: located
    ? esc([neighborhood, postal.addressLocality, postal.addressRegion].filter(Boolean).join(' · ') + ' · CEP ' + postal.postalCode)
    : 'Costa e Silva · Joinville · Santa Catarina',
  FOOTER_PLACE: esc(located ? postal.streetAddress + ' · ' + (neighborhood || 'Costa e Silva') + ' · ' + postal.addressLocality + '/' + postal.addressRegion : 'Costa e Silva · Joinville/SC'),
  MAPS: esc(routeUrl || fallbackMaps), MAPS_LABEL: routeUrl ? 'Como chegar' : 'Buscar referência no Maps',
  MAPS_NOTE: located
    ? 'O mapa usa o endereço da Santos Lavação.'
    : 'Ponto de referência da Santos Lavação.',
  ADDRESS_FAQ: esc(located
    ? 'Rua Guilherme, nº ' + (postal.streetAddress.split(',')[1] || '').replace(/\D/g, '') + ', ' + (neighborhood || 'Costa e Silva') + ', CEP ' + postal.postalCode + ', ' + postal.addressLocality + '/' + postal.addressRegion + '. O box está localizado nos fundos da Peçaville.'
    : 'A referência publicada é nos fundos da Peçaville, no Costa e Silva, em Joinville/SC.'),
  MAP_BLOCK: mapEmbed
    ? '<div class="location-map"><iframe title="Mapa da Santos Lavação na ' + esc(placeQuery) + '" src="' + esc(mapEmbed) + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><p>O trajeto abre em Como chegar.</p></div>'
    : '',
  HOURS_TEXT: esc(config.hoursText), YEAR: new Date().getFullYear()
};
let html = await fs.readFile(path.join(root, 'scripts/index.template.html'), 'utf8');
html = html.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
  if (!(key in values)) throw new Error('Campo de template desconhecido: ' + key);
  return values[key];
});
await fs.writeFile(path.join(root, 'index.html'), html);
const runtime = { mode: config.mode, whatsapp: config.whatsapp, analytics: config.analytics, social };
await fs.writeFile(path.join(root, 'config.js'), 'window.SANTOS_CONFIG = ' + jsonSafe(runtime) + ';\n');
await fs.writeFile(path.join(root, 'robots.txt'), production ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n` : 'User-agent: *\nAllow: /\n# O HTML usa noindex. Não há sitemap de produção.\n');
const pages = production ? `<url><loc>${esc(siteUrl)}</loc></url>` : '';
await fs.writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages}</urlset>\n`);
await fs.writeFile(path.join(root, '.nojekyll'), '');
const notFoundPath = path.join(root, '404.html');
let notFound = await fs.readFile(notFoundPath, 'utf8');
notFound = notFound.replace(/(<a id="home" href=")[^"]*(")/, '$1' + esc(siteUrl || './') + '$2');
notFound = notFound.replace(/<script>[\s\S]*?<\/script>/g, '');
await fs.writeFile(notFoundPath, notFound);
console.log(`Site gerado em ${root}\nModo: ${config.mode}\nSEO: ${production ? 'indexável' : 'não indexável'}\nPerfis conectados: ${Object.values(social).filter(Boolean).length}\nAnalytics: ${config.analytics?.enabled && production ? 'configurado; somente após consentimento' : 'desativado'}`);
