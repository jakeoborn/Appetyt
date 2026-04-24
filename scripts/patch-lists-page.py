#!/usr/bin/env python
"""One-shot patch for the My Lists page:
1. Add CSS for 2-col grid on desktop (fills empty space)
2. Insert A.exportListPDF(listKey) method
3. Change Share button to generate PDF instead of email
4. Add Share buttons to Want to Try + Visited cards
Applies to both duplicate copies of the relevant blocks.
"""
import re, sys

PATH = "index.html"
with open(PATH, "rb") as f:
    data = f.read()
orig_len = len(data)

# ---------- 1. CSS: 2-col grid on desktop ----------
# Insert before the first </head> only. Guard against re-running.
CSS_MARKER = b"/* DH-LISTS-GRID-v1 */"
CSS_BLOCK = b"""
<style>
""" + CSS_MARKER + b"""
@media (min-width: 900px) {
  #lt-lists-content { display: grid; grid-template-columns: 1fr 1fr; column-gap: 14px; max-width: 1200px; margin: 0 auto; }
  #lt-lists-content > .dh-lists-span { grid-column: 1 / -1; }
}
</style>
"""
if CSS_MARKER not in data:
    # Insert right before first </head>
    idx = data.find(b"</head>")
    if idx == -1:
        print("ERR: </head> not found"); sys.exit(1)
    data = data[:idx] + CSS_BLOCK + data[idx:]
    print("CSS inserted")
else:
    print("CSS already present (skip)")

# ---------- 2. Insert exportListPDF method ----------
# Anchor: "  renderLists(){"  (2 copies). Insert new method before each.
METHOD_MARKER = b"exportListPDF(listKey"
METHOD = b"""  exportListPDF(listKey) {
    const restaurants = this.getRestaurants();
    const byId = Object.fromEntries(restaurants.map(r => [r.id, r]));
    let items = [], listName = '', listEmoji = '';
    if (listKey === 'favs')    { items = (S.userData.favs||[]).map(id=>byId[id]).filter(Boolean); listName = 'Favorites'; listEmoji = 'heart'; }
    else if (listKey === 'want') { items = (S.userData.want||[]).map(id=>byId[id]).filter(Boolean); listName = 'Want to Try'; listEmoji = 'bookmark'; }
    else if (listKey === 'visited') { items = (S.userData.visited||[]).map(id=>byId[id]).filter(Boolean); listName = 'Visited'; listEmoji = 'check'; }
    else {
      const cust = (S.userData.customLists||[]).find(l => l.id === listKey);
      if (!cust) { this.showToast('List not found'); return; }
      items = (cust.ids||[]).map(id=>byId[id]).filter(Boolean);
      listName = cust.name;
      listEmoji = cust.emoji || 'list';
    }
    if (!items.length) { this.showToast('List is empty'); return; }
    items.sort((a,b) => (b.score||0) - (a.score||0));
    const today = new Date().toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'});
    const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const priceStr = n => n ? '$'.repeat(Math.max(0, Math.min(4, n))) : '';
    const cards = items.map((r, i) => {
      const photoHtml = r.photoUrl
        ? '<div class="pdf-photo" style="background-image:url(\\'' + esc(r.photoUrl) + '\\')"></div>'
        : '<div class="pdf-photo pdf-photo-empty">' + esc((r.cuisine||'').split(' ')[0] || 'Dim Hour') + '</div>';
      const tags = (r.tags||[]).slice(0,4).map(t => '<span class="pdf-tag">' + esc(t) + '</span>').join('');
      const desc = r.description ? '<div class="pdf-desc">' + esc(r.description).slice(0, 280) + (r.description.length > 280 ? '\\u2026' : '') + '</div>' : '';
      const score = r.score ? '<span class="pdf-score">' + r.score + '</span>' : '';
      return '<div class="pdf-card">' + photoHtml +
        '<div class="pdf-body">' +
          '<div class="pdf-rank">' + String(i+1).padStart(2,'0') + '</div>' + score +
          '<div class="pdf-name">' + esc(r.name) + '</div>' +
          '<div class="pdf-meta">' + [esc(r.cuisine||''), esc(r.neighborhood||''), priceStr(r.price)].filter(Boolean).join(' \\u00b7 ') + '</div>' +
          (r.address ? '<div class="pdf-address">' + esc(r.address) + '</div>' : '') +
          desc +
          (tags ? '<div class="pdf-tags">' + tags + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + esc(listName) + ' \\u2014 Dim Hour</title>' +
'<style>' +
'@page { size: letter; margin: 0.5in; }' +
'body { font-family: Georgia, serif; color: #1a1a1a; line-height: 1.4; max-width: 7.5in; margin: 0 auto; padding: 20px; background: #fafafa; }' +
'.pdf-header { border-bottom: 2px solid #c9a84c; padding-bottom: 14px; margin-bottom: 28px; }' +
'.pdf-eyebrow { font-family: \\'Helvetica Neue\\', Arial, sans-serif; font-size: 10px; letter-spacing: 3px; color: #c9a84c; text-transform: uppercase; font-weight: 700; }' +
'.pdf-title { font-size: 42px; font-style: italic; font-weight: 700; color: #1a1a1a; margin: 6px 0 0; letter-spacing: -0.02em; }' +
'.pdf-subtitle { font-family: \\'Helvetica Neue\\', sans-serif; font-size: 11px; color: #777; margin-top: 4px; letter-spacing: 1px; }' +
'.pdf-card { display: flex; gap: 16px; margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid #e5e5e5; page-break-inside: avoid; }' +
'.pdf-photo { width: 140px; height: 140px; flex-shrink: 0; background-size: cover; background-position: center; border-radius: 6px; background-color: #f0ede5; }' +
'.pdf-photo-empty { display: flex; align-items: center; justify-content: center; font-family: \\'Helvetica Neue\\', sans-serif; font-size: 11px; letter-spacing: 2px; color: #c9a84c; text-transform: uppercase; text-align: center; padding: 6px; }' +
'.pdf-body { flex: 1; min-width: 0; position: relative; padding-right: 60px; }' +
'.pdf-rank { position: absolute; right: 0; top: 0; font-family: \\'Helvetica Neue\\', sans-serif; font-size: 10px; color: #c9a84c; font-weight: 700; letter-spacing: 2px; }' +
'.pdf-score { position: absolute; right: 0; top: 14px; font-family: \\'Helvetica Neue\\', sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 800; }' +
'.pdf-name { font-style: italic; font-size: 22px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.015em; margin-bottom: 4px; line-height: 1.15; }' +
'.pdf-meta { font-family: \\'Helvetica Neue\\', sans-serif; font-size: 11px; color: #666; margin-bottom: 6px; letter-spacing: 0.3px; }' +
'.pdf-address { font-family: \\'Helvetica Neue\\', sans-serif; font-size: 10px; color: #999; margin-bottom: 8px; }' +
'.pdf-desc { font-size: 12.5px; color: #333; margin-bottom: 8px; line-height: 1.5; }' +
'.pdf-tags { display: flex; flex-wrap: wrap; gap: 4px; }' +
'.pdf-tag { font-family: \\'Helvetica Neue\\', sans-serif; font-size: 9px; padding: 2px 7px; border: 1px solid #c9a84c; border-radius: 3px; color: #8a7532; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }' +
'.pdf-footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e5e5e5; text-align: center; font-family: \\'Helvetica Neue\\', sans-serif; font-size: 9px; color: #999; letter-spacing: 2px; text-transform: uppercase; }' +
'.pdf-print-btn { position: fixed; top: 16px; right: 16px; background: #c9a84c; color: #fff; border: none; padding: 12px 20px; font-size: 13px; font-weight: 700; border-radius: 8px; cursor: pointer; font-family: \\'Helvetica Neue\\', sans-serif; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 10; }' +
'@media print { .pdf-print-btn { display: none; } body { padding: 0; background: #fff; } }' +
'</style></head><body>' +
'<button class="pdf-print-btn" onclick="window.print()">Save as PDF</button>' +
'<div class="pdf-header">' +
'<div class="pdf-eyebrow">Dim Hour \\u00b7 Dossier</div>' +
'<div class="pdf-title">' + esc(listName) + '</div>' +
'<div class="pdf-subtitle">' + items.length + ' ' + (items.length === 1 ? 'spot' : 'spots') + ' \\u00b7 exported ' + esc(today) + '</div>' +
'</div>' +
cards +
'<div class="pdf-footer">Dim Hour \\u00b7 appetyt.app</div>' +
'</body></html>';
    const w = window.open('', '_blank');
    if (!w) { this.showToast('Pop-up blocked \\u2014 allow popups to export PDF'); return; }
    w.document.write(html);
    w.document.close();
    this.showToast('Use Save as PDF in the new tab');
  },

"""
# Insert before each "  renderLists(){"  only if marker not nearby
if METHOD_MARKER not in data:
    # Find all "  renderLists(){" anchors
    anchor = b"  renderLists(){"
    offset = 0
    inserted = 0
    while True:
        idx = data.find(anchor, offset)
        if idx == -1: break
        data = data[:idx] + METHOD + data[idx:]
        inserted += 1
        offset = idx + len(METHOD) + len(anchor)
    print(f"exportListPDF inserted at {inserted} locations")
else:
    print("exportListPDF already present (skip)")

# ---------- 3. Change Share button to PDF + add Share to Want + Visited ----------
# Current share button (favorites only):
OLD_SHARE = b"    const shareBtn = `<button onclick=\"event.stopPropagation();A.emailFavorites()\" style=\"font-size:10px;color:var(--gold);background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);padding:4px 10px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600;flex-shrink:0\">\xf0\x9f\x93\xa7 Share</button>`;"
NEW_SHARE_HELPER = b"    const pdfBtn = (key) => `<button onclick=\"event.stopPropagation();A.exportListPDF('${key}')\" style=\"font-size:10px;color:var(--gold);background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);padding:4px 10px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600;flex-shrink:0\">PDF</button>`;\n    const shareBtn = pdfBtn('favs');"
cnt = data.count(OLD_SHARE)
if cnt > 0:
    data = data.replace(OLD_SHARE, NEW_SHARE_HELPER)
    print(f"Share button swapped to PDF at {cnt} locations")
else:
    print("Share button not found or already updated")

# Add pdfBtn action to Want to Try + Visited cards
OLD_WANT = b"listCard({ emoji:'\xf0\x9f\x94\x96', tone:'gold',  title:'Want to Try', subtitle:'Your saved spots',     items:want,    empty:'No spots saved yet \xe2\x80\x94 bookmark any card to add to Want to Try.' })"
NEW_WANT = b"listCard({ emoji:'\xf0\x9f\x94\x96', tone:'gold',  title:'Want to Try', subtitle:'Your saved spots',     items:want,    empty:'No spots saved yet \xe2\x80\x94 bookmark any card to add to Want to Try.', action: pdfBtn('want') })"
c = data.count(OLD_WANT)
if c > 0:
    data = data.replace(OLD_WANT, NEW_WANT)
    print(f"Want to Try share added at {c} locations")

OLD_VIS = b"listCard({ emoji:'\xe2\x9c\x93', tone:'green', title:'Visited',    subtitle:'Places you have been', items:visited, empty:'Mark restaurants visited to build your history.' })"
NEW_VIS = b"listCard({ emoji:'\xe2\x9c\x93', tone:'green', title:'Visited',    subtitle:'Places you have been', items:visited, empty:'Mark restaurants visited to build your history.', action: pdfBtn('visited') })"
c = data.count(OLD_VIS)
if c > 0:
    data = data.replace(OLD_VIS, NEW_VIS)
    print(f"Visited share added at {c} locations")

# ---------- 4. Mark wrapper divs for grid-spanning (title sections full-width) ----------
# Tag the YOUR DOSSIER block + section headers so they span both columns on desktop
# The first wrapping div: <div style="padding:18px 4px 4px">
OLD_HEADER = b'<div style="padding:18px 4px 4px">\n        <div style="font-family:var(--sans);font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);font-weight:600">Your Dossier</div>'
NEW_HEADER = b'<div class="dh-lists-span" style="padding:18px 4px 4px">\n        <div style="font-family:var(--sans);font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);font-weight:600">Your Dossier</div>'
c = data.count(OLD_HEADER)
if c > 0:
    data = data.replace(OLD_HEADER, NEW_HEADER)
    print(f"Header span class added at {c} locations")

# Section title "My Lists · 3 system"
OLD_SECT = b'<div style="margin-top:22px;margin-bottom:10px">\n        <div style="font-family:var(--sans);font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:var(--gold);font-weight:600">My Lists \xc2\xb7 3 system</div>'
NEW_SECT = b'<div class="dh-lists-span" style="margin-top:22px;margin-bottom:10px">\n        <div style="font-family:var(--sans);font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:var(--gold);font-weight:600">My Lists \xc2\xb7 3 system</div>'
c = data.count(OLD_SECT)
if c > 0:
    data = data.replace(OLD_SECT, NEW_SECT)
    print(f"Section title span class added at {c} locations")

# Trip hero block: starts with "<div onclick=\"A.tab('trips')\" style=\"margin-top:18px"
OLD_TRIP = b'<div onclick="A.tab(\'trips\')" style="margin-top:18px;padding:14px;border-radius:14px;background:linear-gradient(135deg,#2d1a10,#0a0d14)'
NEW_TRIP = b'<div class="dh-lists-span" onclick="A.tab(\'trips\')" style="margin-top:18px;padding:14px;border-radius:14px;background:linear-gradient(135deg,#2d1a10,#0a0d14)'
c = data.count(OLD_TRIP)
if c > 0:
    data = data.replace(OLD_TRIP, NEW_TRIP)
    print(f"Trip hero span class added at {c} locations")

# Custom lists section header
OLD_CUST = b'<div style="margin-top:22px;margin-bottom:10px;display:flex;align-items:baseline;justify-content:space-between;gap:10px">\n            <div>\n              <div style="font-family:var(--sans);font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:var(--gold);font-weight:600">Custom Lists'
NEW_CUST = b'<div class="dh-lists-span" style="margin-top:22px;margin-bottom:10px;display:flex;align-items:baseline;justify-content:space-between;gap:10px">\n            <div>\n              <div style="font-family:var(--sans);font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:var(--gold);font-weight:600">Custom Lists'
c = data.count(OLD_CUST)
if c > 0:
    data = data.replace(OLD_CUST, NEW_CUST)
    print(f"Custom lists header span class added at {c} locations")

# ---------- Write ----------
with open(PATH, "wb") as f:
    f.write(data)
print(f"\nfile: {orig_len} -> {len(data)} ({len(data)-orig_len:+d} bytes)")
