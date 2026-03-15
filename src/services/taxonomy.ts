export async function translateTaxonomy(name?: string): Promise<string> {
  if (!name) return '—';

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      console.error('Translation API request failed for:', name);
      return name; // 出错时回退到原始名称
    }

    const data = await res.json();
    return data.translatedName || name;
  } catch (e) {
    console.error('Translation fetch failed for:', name, e);
    return name; // 网络等错误时回退到原始名称
  }
}
