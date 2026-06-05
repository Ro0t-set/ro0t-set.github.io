// cv-generator.js — Generatore CV dinamico con riordinamento drag-and-drop
(function () {
    'use strict';

    // --- Helpers ---
    function getSiteLang() {
        return localStorage.getItem('portfolio-lang') || 'it';
    }

    // Lingua scelta per il CV (indipendente dal sito)
    var cvLang = 'it';

    function t(obj, lang) {
        if (obj == null) return '';
        if (typeof obj === 'string') return obj;
        var l = lang || cvLang;
        return obj[l] || obj.it || '';
    }

    // Ordine sezioni corrente (viene aggiornato dal drag-and-drop)
    var sectionOrder = [];

    // SVG icona drag handle (6 puntini)
    var gripSvg = '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>';

    // --- Render toggle con drag handle ---
    function renderSectionToggles() {
        var container = document.getElementById('cvSectionsList');
        if (!container) return;
        container.innerHTML = '';

        // Inizializza ordine sezioni
        sectionOrder = CV_DATA.sections.map(function (s) { return s.key; });

        CV_DATA.sections.forEach(function (section) {
            var row = document.createElement('div');
            row.className = 'cv-section-row';
            row.setAttribute('draggable', 'true');
            row.dataset.key = section.key;

            row.innerHTML =
                '<div class="cv-drag-handle" title="Trascina per riordinare">' + gripSvg + '</div>' +
                '<label class="cv-toggle-label">' +
                    '<input type="checkbox" checked data-section="' + section.key + '">' +
                    '<span class="cv-toggle-switch"></span>' +
                    '<span class="cv-toggle-text">' + t(section.label, getSiteLang()) + '</span>' +
                '</label>';

            container.appendChild(row);
        });

        initDragAndDrop(container);
    }

    // --- Drag and Drop ---
    function initDragAndDrop(container) {
        var draggedEl = null;

        container.addEventListener('dragstart', function (e) {
            var row = e.target.closest('.cv-section-row');
            if (!row) return;
            draggedEl = row;
            row.classList.add('cv-dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', row.dataset.key);
        });

        container.addEventListener('dragend', function () {
            if (draggedEl) {
                draggedEl.classList.remove('cv-dragging');
                draggedEl = null;
            }
            // Rimuovi tutti gli indicatori
            var rows = container.querySelectorAll('.cv-section-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('cv-drag-over');
            }
        });

        container.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            var row = e.target.closest('.cv-section-row');
            if (!row || row === draggedEl) return;

            // Rimuovi indicatori precedenti
            var rows = container.querySelectorAll('.cv-section-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('cv-drag-over');
            }
            row.classList.add('cv-drag-over');
        });

        container.addEventListener('dragleave', function (e) {
            var row = e.target.closest('.cv-section-row');
            if (row) row.classList.remove('cv-drag-over');
        });

        container.addEventListener('drop', function (e) {
            e.preventDefault();
            var targetRow = e.target.closest('.cv-section-row');
            if (!targetRow || !draggedEl || targetRow === draggedEl) return;

            // Inserisci prima del target
            container.insertBefore(draggedEl, targetRow);

            // Aggiorna ordine sezioni
            var rows = container.querySelectorAll('.cv-section-row');
            sectionOrder = [];
            for (var i = 0; i < rows.length; i++) {
                sectionOrder.push(rows[i].dataset.key);
                rows[i].classList.remove('cv-drag-over');
            }
        });

        // Touch support per mobile
        var touchDragged = null;
        var touchClone = null;
        var touchStartY = 0;

        container.addEventListener('touchstart', function (e) {
            var handle = e.target.closest('.cv-drag-handle');
            if (!handle) return;
            var row = handle.closest('.cv-section-row');
            if (!row) return;

            touchDragged = row;
            touchStartY = e.touches[0].clientY;

            // Crea clone visuale
            touchClone = row.cloneNode(true);
            touchClone.style.position = 'fixed';
            touchClone.style.zIndex = '10000';
            touchClone.style.width = row.offsetWidth + 'px';
            touchClone.style.opacity = '0.8';
            touchClone.style.pointerEvents = 'none';
            touchClone.style.left = row.getBoundingClientRect().left + 'px';
            touchClone.style.top = row.getBoundingClientRect().top + 'px';
            document.body.appendChild(touchClone);

            row.classList.add('cv-dragging');
        }, { passive: true });

        container.addEventListener('touchmove', function (e) {
            if (!touchDragged || !touchClone) return;
            e.preventDefault();

            var touch = e.touches[0];
            touchClone.style.top = touch.clientY - 20 + 'px';

            // Trova l'elemento sotto il touch
            touchClone.style.display = 'none';
            var elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            touchClone.style.display = '';

            var rows = container.querySelectorAll('.cv-section-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('cv-drag-over');
            }

            if (elemBelow) {
                var targetRow = elemBelow.closest('.cv-section-row');
                if (targetRow && targetRow !== touchDragged) {
                    targetRow.classList.add('cv-drag-over');
                }
            }
        }, { passive: false });

        container.addEventListener('touchend', function () {
            if (!touchDragged) return;

            // Trova il target con cv-drag-over
            var target = container.querySelector('.cv-drag-over');
            if (target && target !== touchDragged) {
                container.insertBefore(touchDragged, target);
            }

            // Cleanup
            touchDragged.classList.remove('cv-dragging');
            if (touchClone && touchClone.parentNode) {
                touchClone.parentNode.removeChild(touchClone);
            }

            // Aggiorna ordine
            var rows = container.querySelectorAll('.cv-section-row');
            sectionOrder = [];
            for (var i = 0; i < rows.length; i++) {
                sectionOrder.push(rows[i].dataset.key);
                rows[i].classList.remove('cv-drag-over');
            }

            touchDragged = null;
            touchClone = null;
        });
    }

    // --- PDF vettoriale ---
    var PDF_COLORS = {
        accent: '#0b63f6',
        accentDark: '#0648b7',
        text: '#171717',
        softText: '#525866',
        muted: '#7b8494',
        rule: '#d9dee8',
        lightRule: '#e8edf5',
        surface: '#f7f9fc',
        tagFill: '#eef4ff'
    };

    var MONTHS = {
        gen: 1, gennaio: 1, jan: 1, january: 1,
        feb: 2, febbraio: 2, february: 2,
        mar: 3, marzo: 3, march: 3,
        apr: 4, aprile: 4, april: 4,
        mag: 5, maggio: 5, may: 5,
        giu: 6, giugno: 6, jun: 6, june: 6,
        lug: 7, luglio: 7, jul: 7, july: 7,
        ago: 8, agosto: 8, aug: 8, august: 8,
        set: 9, settembre: 9, sep: 9, sept: 9, september: 9,
        ott: 10, ottobre: 10, oct: 10, october: 10,
        nov: 11, novembre: 11, november: 11,
        dic: 12, dicembre: 12, dec: 12, december: 12
    };

    function cleanText(value) {
        return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
    }

    function rawDateText(value) {
        if (value == null) return '';
        if (typeof value === 'string') return value;
        return value.it || value.en || t(value);
    }

    function parseDatePoint(text, isEnd) {
        var normalized = cleanText(text).toLowerCase().replace(/\./g, '');
        if (/presente|present|current|oggi/.test(normalized)) return 999912;

        var monthPattern = '(gennaio|gen|january|jan|febbraio|feb|february|marzo|mar|march|aprile|apr|april|maggio|mag|may|giugno|giu|june|jun|luglio|lug|july|jul|agosto|ago|august|aug|settembre|set|september|sept|sep|ottobre|ott|october|oct|novembre|nov|november|dicembre|dic|december|dec)';
        var monthMatch = normalized.match(new RegExp('\\b' + monthPattern + '\\s+(19\\d{2}|20\\d{2})\\b'));
        if (monthMatch) {
            return Number(monthMatch[2]) * 100 + MONTHS[monthMatch[1]];
        }

        var years = normalized.match(/\b(19\d{2}|20\d{2})\b/g);
        if (years && years.length) {
            var year = Number(isEnd ? years[years.length - 1] : years[0]);
            return year * 100 + (isEnd ? 12 : 1);
        }

        return 0;
    }

    function chronologicalScore(item, index) {
        var parts = rawDateText(item.date).split(/\s+[—–-]\s+/);
        var start = parseDatePoint(parts[0], false);
        var end = parts.length > 1 ? parseDatePoint(parts[parts.length - 1], true) : parseDatePoint(parts[0], true);
        return { item: item, start: start, end: end, index: index };
    }

    function sortItemsByDateDesc(items) {
        return items.map(chronologicalScore).sort(function (a, b) {
            if (b.end !== a.end) return b.end - a.end;
            if (b.start !== a.start) return b.start - a.start;
            return a.index - b.index;
        }).map(function (entry) {
            return entry.item;
        });
    }

    function hexToRgb(hex) {
        var normalized = hex.replace('#', '');
        return {
            r: parseInt(normalized.slice(0, 2), 16),
            g: parseInt(normalized.slice(2, 4), 16),
            b: parseInt(normalized.slice(4, 6), 16)
        };
    }

    function setTextColor(doc, hex) {
        var color = hexToRgb(hex);
        doc.setTextColor(color.r, color.g, color.b);
    }

    function setDrawColor(doc, hex) {
        var color = hexToRgb(hex);
        doc.setDrawColor(color.r, color.g, color.b);
    }

    function setFillColor(doc, hex) {
        var color = hexToRgb(hex);
        doc.setFillColor(color.r, color.g, color.b);
    }

    function setFont(doc, size, style, color) {
        doc.setFont('helvetica', style || 'normal');
        doc.setFontSize(size);
        setTextColor(doc, color || PDF_COLORS.text);
    }

    function lineHeight(size, multiplier) {
        return size * 0.3528 * (multiplier || 1.32);
    }

    function createPdfState(doc) {
        return {
            doc: doc,
            pageW: 210,
            pageH: 297,
            marginL: 17,
            marginR: 17,
            marginT: 16,
            marginB: 17,
            contentW: 176,
            y: 16
        };
    }

    function pageBottom(state) {
        return state.pageH - state.marginB;
    }

    function drawContinuationHeader(state) {
        var doc = state.doc;
        setFont(doc, 7.5, 'bold', PDF_COLORS.muted);
        doc.text(CV_DATA.meta.name, state.marginL, 12);
        setFont(doc, 7.5, 'normal', PDF_COLORS.muted);
        doc.text('Curriculum Vitae', state.pageW - state.marginR, 12, { align: 'right' });
        setDrawColor(doc, PDF_COLORS.lightRule);
        doc.setLineWidth(0.25);
        doc.line(state.marginL, 15, state.pageW - state.marginR, 15);
        state.y = 23;
    }

    function addPage(state) {
        state.doc.addPage();
        state.y = state.marginT;
        drawContinuationHeader(state);
    }

    function ensureSpace(state, height) {
        if (state.y + height > pageBottom(state)) addPage(state);
    }

    function wrapText(doc, text, width, size, style) {
        setFont(doc, size, style || 'normal', PDF_COLORS.text);
        return doc.splitTextToSize(cleanText(text), width);
    }

    function drawLines(state, lines, x, y, size, style, color, multiplier) {
        var doc = state.doc;
        var lh = lineHeight(size, multiplier);
        setFont(doc, size, style || 'normal', color || PDF_COLORS.text);
        for (var i = 0; i < lines.length; i++) {
            doc.text(lines[i], x, y);
            y += lh;
        }
        return y;
    }

    function measureItemLinks(item, size) {
        if (!item.links || !item.links.length) return 0;
        return item.links.length * lineHeight(size || 8.1, 1.25) + 1.4;
    }

    function drawItemLinks(state, links, x, y, size) {
        var doc = state.doc;
        var linkSize = size || 8.1;
        var lh = lineHeight(linkSize, 1.25);
        setFont(doc, linkSize, 'bold', PDF_COLORS.accentDark);
        links.forEach(function (link) {
            var label = cleanText(t(link.label || link.url));
            if (typeof doc.textWithLink === 'function') {
                doc.textWithLink(label, x, y, { url: link.url });
            } else {
                doc.text(label, x, y);
                doc.link(x, y - lh + 1, doc.getTextWidth(label), lh, { url: link.url });
            }
            y += lh;
        });
        return y;
    }

    function measureTags(tags, maxWidth, fontSize, padX, tagH, gap) {
        var doc = measureTags.doc;
        var x = 0;
        var rows = 1;
        setFont(doc, fontSize, 'normal', PDF_COLORS.softText);

        tags.forEach(function (tag) {
            var label = cleanText(t(tag));
            var width = Math.min(maxWidth, doc.getTextWidth(label) + padX * 2);
            if (x > 0 && x + width > maxWidth) {
                rows++;
                x = 0;
            }
            x += width + gap;
        });

        return rows * tagH + (rows - 1) * gap;
    }

    function drawTags(state, tags, x, y, maxWidth, options) {
        var doc = state.doc;
        var fontSize = options.fontSize || 7;
        var padX = options.padX || 2.6;
        var tagH = options.tagH || 5.2;
        var gap = options.gap || 2;
        var cursorX = 0;

        setFont(doc, fontSize, 'normal', options.text || PDF_COLORS.softText);

        tags.forEach(function (tag) {
            var label = cleanText(t(tag));
            var width = Math.min(maxWidth, doc.getTextWidth(label) + padX * 2);
            if (cursorX > 0 && cursorX + width > maxWidth) {
                cursorX = 0;
                y += tagH + gap;
            }

            setFillColor(doc, options.fill || PDF_COLORS.tagFill);
            setDrawColor(doc, options.stroke || '#d6e5ff');
            doc.setLineWidth(0.22);
            doc.roundedRect(x + cursorX, y, width, tagH, 1.5, 1.5, 'FD');
            setFont(doc, fontSize, 'normal', options.text || PDF_COLORS.softText);
            doc.text(label, x + cursorX + padX, y + 3.55);
            cursorX += width + gap;
        });

        return y + tagH;
    }

    function drawHeader(state) {
        var doc = state.doc;
        var m = CV_DATA.meta;
        var rightX = state.pageW - state.marginR;
        var contactY = state.y + 1;
        var contacts = [m.phone, m.email, m.location, m.website, m.github, m.linkedin];
        if (m.pec) contacts.splice(2, 0, m.pec + ' (PEC)');

        setFillColor(doc, PDF_COLORS.accent);
        doc.rect(0, 0, 4.2, state.pageH, 'F');

        setFont(doc, 22, 'bold', PDF_COLORS.accentDark);
        doc.text(m.name, state.marginL, state.y + 8);
        setFont(doc, 10.5, 'normal', PDF_COLORS.softText);
        doc.text(t(m.title), state.marginL, state.y + 15);
        setFont(doc, 8, 'normal', PDF_COLORS.muted);
        doc.text(m.vat, state.marginL, state.y + 21);

        setFont(doc, 7.6, 'normal', PDF_COLORS.softText);
        contacts.forEach(function (line) {
            doc.text(line, rightX, contactY, { align: 'right' });
            contactY += 4.1;
        });

        setDrawColor(doc, PDF_COLORS.rule);
        doc.setLineWidth(0.35);
        doc.line(state.marginL, 43, rightX, 43);
        setDrawColor(doc, PDF_COLORS.accent);
        doc.setLineWidth(1.05);
        doc.line(state.marginL, 43, state.marginL + 42, 43);

        state.y = 52;
    }

    function sectionStartHeight(state, section) {
        var first = 0;
        if (section.type === 'text') first = measureTextSection(state, section);
        if (section.type === 'timeline') first = measureTimelineItem(state, sortItemsByDateDesc(section.items)[0]);
        if (section.type === 'projects') first = measureProjectItem(state, sortItemsByDateDesc(section.items)[0]);
        if (section.type === 'tags') {
            first = section.categories.reduce(function (total, cat) {
                return total + measureTagCategory(state, cat);
            }, 0);
        }
        if (section.type === 'repos') {
            for (var i = 0; i < section.items.length; i += 2) {
                first += measureRepoRow(state, section.items.slice(i, i + 2));
            }
        }
        if ((section.type === 'tags' || section.type === 'repos') && first <= pageBottom(state) - state.marginT - 12) {
            return 12 + first;
        }
        return 12 + Math.min(first, 34);
    }

    function drawSectionHeading(state, label) {
        var doc = state.doc;
        if (state.y > 24) state.y += 4;

        setFont(doc, 8.6, 'bold', PDF_COLORS.accentDark);
        doc.text(cleanText(t(label)).toUpperCase(), state.marginL, state.y);
        setDrawColor(doc, PDF_COLORS.lightRule);
        doc.setLineWidth(0.25);
        doc.line(state.marginL + 38, state.y - 1.2, state.pageW - state.marginR, state.y - 1.2);
        state.y += 6.5;
    }

    function measureTextSection(state, section) {
        var lines = wrapText(state.doc, t(section.content), state.contentW, 9.2, 'normal');
        return lines.length * lineHeight(9.2, 1.42) + 2;
    }

    function drawTextSection(state, section) {
        var lines = wrapText(state.doc, t(section.content), state.contentW, 9.2, 'normal');
        ensureSpace(state, measureTextSection(state, section));
        state.y = drawLines(state, lines, state.marginL, state.y, 9.2, 'normal', PDF_COLORS.softText, 1.42) + 1;
    }

    function measureTimelineItem(state, item) {
        if (!item) return 0;
        var contentW = state.contentW - 39;
        var titleLines = wrapText(state.doc, t(item.title), contentW, 9.4, 'bold');
        var orgLines = wrapText(state.doc, t(item.company), contentW, 8.4, 'bold');
        var descLines = item.description ? wrapText(state.doc, t(item.description), contentW, 8.25, 'normal') : [];
        return Math.max(5, titleLines.length * lineHeight(9.4, 1.18) + orgLines.length * lineHeight(8.4, 1.2) + descLines.length * lineHeight(8.25, 1.32) + measureItemLinks(item, 8.1) + 4.5);
    }

    function drawTimelineItem(state, item) {
        var doc = state.doc;
        var height = measureTimelineItem(state, item);
        var xDate = state.marginL;
        var xContent = state.marginL + 39;
        var contentW = state.contentW - 39;
        var y = state.y;

        ensureSpace(state, height);
        y = state.y;

        setDrawColor(doc, PDF_COLORS.lightRule);
        doc.setLineWidth(0.32);
        doc.line(xContent - 5, y + 1.5, xContent - 5, y + height - 2);
        setFillColor(doc, PDF_COLORS.accent);
        doc.circle(xContent - 5, y + 2.3, 1.15, 'F');

        setFont(doc, 7.1, 'normal', PDF_COLORS.muted);
        doc.text(cleanText(t(item.date)), xDate, y + 2.9);

        var cursorY = y + 2.9;
        cursorY = drawLines(state, wrapText(doc, t(item.title), contentW, 9.4, 'bold'), xContent, cursorY, 9.4, 'bold', PDF_COLORS.text, 1.18);
        cursorY = drawLines(state, wrapText(doc, t(item.company), contentW, 8.4, 'bold'), xContent, cursorY + 0.3, 8.4, 'bold', PDF_COLORS.accentDark, 1.2);
        if (item.description) {
            cursorY = drawLines(state, wrapText(doc, t(item.description), contentW, 8.25, 'normal'), xContent, cursorY + 0.9, 8.25, 'normal', PDF_COLORS.softText, 1.32);
        }
        if (item.links && item.links.length) {
            drawItemLinks(state, item.links, xContent, cursorY + 0.8, 8.1);
        }

        state.y = y + height + 2.5;
    }

    function measureProjectItem(state, item) {
        if (!item) return 0;
        var contentW = state.contentW - 39;
        var titleLines = wrapText(state.doc, t(item.title), contentW, 9.4, 'bold');
        var clientLines = wrapText(state.doc, t(item.client), contentW, 8.4, 'bold');
        var descLines = item.description ? wrapText(state.doc, t(item.description), contentW, 8.15, 'normal') : [];
        var height = titleLines.length * lineHeight(9.4, 1.18) + clientLines.length * lineHeight(8.4, 1.2) + descLines.length * lineHeight(8.15, 1.32) + 5.2;

        if (item.tech && item.tech.length) {
            measureTags.doc = state.doc;
            height += measureTags(item.tech, contentW, 6.8, 2.3, 4.8, 1.8) + 2.5;
        }

        return Math.max(8, height);
    }

    function drawProjectItem(state, item) {
        var doc = state.doc;
        var height = measureProjectItem(state, item);
        var xDate = state.marginL;
        var xContent = state.marginL + 39;
        var contentW = state.contentW - 39;
        var y = state.y;

        ensureSpace(state, height);
        y = state.y;

        setFillColor(doc, PDF_COLORS.surface);
        setDrawColor(doc, PDF_COLORS.lightRule);
        doc.setLineWidth(0.25);
        doc.roundedRect(xContent - 2.8, y - 1.8, contentW + 5.6, height - 0.2, 2, 2, 'FD');

        setFont(doc, 7.1, 'normal', PDF_COLORS.muted);
        doc.text(cleanText(t(item.date)), xDate, y + 2.6);

        var cursorY = y + 2.8;
        cursorY = drawLines(state, wrapText(doc, t(item.title), contentW, 9.4, 'bold'), xContent, cursorY, 9.4, 'bold', PDF_COLORS.text, 1.18);
        cursorY = drawLines(state, wrapText(doc, t(item.client), contentW, 8.4, 'bold'), xContent, cursorY + 0.3, 8.4, 'bold', PDF_COLORS.accentDark, 1.2);
        if (item.description) {
            cursorY = drawLines(state, wrapText(doc, t(item.description), contentW, 8.15, 'normal'), xContent, cursorY + 0.9, 8.15, 'normal', PDF_COLORS.softText, 1.32);
        }
        if (item.tech && item.tech.length) {
            drawTags(state, item.tech, xContent, cursorY + 1.3, contentW, {
                fontSize: 6.8,
                padX: 2.3,
                tagH: 4.8,
                gap: 1.8,
                fill: '#ffffff',
                stroke: '#dbe6f6',
                text: PDF_COLORS.softText
            });
        }

        state.y = y + height + 2.6;
    }

    function measureTagCategory(state, cat) {
        if (!cat) return 0;
        measureTags.doc = state.doc;
        return 4.4 + measureTags(cat.tags, state.contentW, 8, 2.8, 5.5, 2) + 4;
    }

    function drawTagCategory(state, cat) {
        var height = measureTagCategory(state, cat);
        ensureSpace(state, height);

        setFont(state.doc, 7.2, 'bold', PDF_COLORS.muted);
        state.doc.text(cleanText(t(cat.label)).toUpperCase(), state.marginL, state.y);
        state.y = drawTags(state, cat.tags, state.marginL, state.y + 2.3, state.contentW, {
            fontSize: 8,
            padX: 2.8,
            tagH: 5.5,
            gap: 2,
            fill: PDF_COLORS.surface,
            stroke: PDF_COLORS.lightRule,
            text: PDF_COLORS.softText
        }) + 4;
    }

    function measureRepoCard(state, item, width) {
        var descLines = wrapText(state.doc, t(item.description), width - 8, 8, 'normal');
        return 15.8 + descLines.length * lineHeight(8, 1.25);
    }

    function measureRepoRow(state, rowItems) {
        if (!rowItems.length) return 0;
        var gap = 4;
        var width = (state.contentW - gap) / 2;
        var max = 0;
        rowItems.forEach(function (item) {
            max = Math.max(max, measureRepoCard(state, item, width));
        });
        return max + 4;
    }

    function drawRepoCard(state, item, x, y, width, height) {
        var doc = state.doc;
        setFillColor(doc, '#ffffff');
        setDrawColor(doc, PDF_COLORS.lightRule);
        doc.setLineWidth(0.25);
        doc.roundedRect(x, y, width, height, 2, 2, 'FD');

        setFont(doc, 8.8, 'bold', PDF_COLORS.text);
        doc.text(item.name, x + 4, y + 5.2);

        setFont(doc, 6.6, 'bold', PDF_COLORS.accentDark);
        var langWidth = doc.getTextWidth(item.lang) + 5;
        setFillColor(doc, PDF_COLORS.tagFill);
        setDrawColor(doc, '#d6e5ff');
        doc.roundedRect(x + width - langWidth - 4, y + 2.3, langWidth, 4.6, 1.3, 1.3, 'FD');
        setFont(doc, 6.6, 'bold', PDF_COLORS.accentDark);
        doc.text(item.lang, x + width - langWidth - 1.5, y + 5.55);

        drawLines(state, wrapText(doc, t(item.description), width - 8, 8, 'normal'), x + 4, y + 11.1, 8, 'normal', PDF_COLORS.softText, 1.25);
        setFont(doc, 7, 'normal', PDF_COLORS.muted);
        doc.text(item.stars + ' stars', x + 4, y + height - 4.2);
    }

    function drawRepos(state, section) {
        var gap = 4;
        var width = (state.contentW - gap) / 2;
        for (var i = 0; i < section.items.length; i += 2) {
            var row = section.items.slice(i, i + 2);
            var rowHeight = measureRepoRow(state, row);
            ensureSpace(state, rowHeight);
            for (var j = 0; j < row.length; j++) {
                drawRepoCard(state, row[j], state.marginL + j * (width + gap), state.y, width, rowHeight - 4);
            }
            state.y += rowHeight;
        }
    }

    function drawSection(state, section) {
        ensureSpace(state, sectionStartHeight(state, section));
        drawSectionHeading(state, section.label);

        switch (section.type) {
            case 'text':
                drawTextSection(state, section);
                break;
            case 'timeline':
                sortItemsByDateDesc(section.items).forEach(function (item) {
                    drawTimelineItem(state, item);
                });
                break;
            case 'projects':
                sortItemsByDateDesc(section.items).forEach(function (item) {
                    drawProjectItem(state, item);
                });
                break;
            case 'tags':
                section.categories.forEach(function (cat) {
                    drawTagCategory(state, cat);
                });
                break;
            case 'repos':
                drawRepos(state, section);
                break;
        }
    }

    function selectedSections(selectedKeys) {
        var orderedSections = [];
        for (var i = 0; i < sectionOrder.length; i++) {
            var key = sectionOrder[i];
            if (selectedKeys.indexOf(key) === -1) continue;
            for (var j = 0; j < CV_DATA.sections.length; j++) {
                if (CV_DATA.sections[j].key === key) {
                    orderedSections.push(CV_DATA.sections[j]);
                    break;
                }
            }
        }
        return orderedSections;
    }

    function drawFooters(state) {
        var doc = state.doc;
        var total = doc.getNumberOfPages();
        for (var i = 1; i <= total; i++) {
            doc.setPage(i);
            setDrawColor(doc, PDF_COLORS.lightRule);
            doc.setLineWidth(0.2);
            doc.line(state.marginL, state.pageH - 12, state.pageW - state.marginR, state.pageH - 12);
            setFont(doc, 7, 'normal', PDF_COLORS.muted);
            doc.text(String(i) + ' / ' + String(total), state.pageW - state.marginR, state.pageH - 7.2, { align: 'right' });
        }
    }

    // --- Generazione PDF ---
    function generatePdf(selectedKeys) {
        return new Promise(function (resolve, reject) {
            try {
                var JsPDF = window.jspdf && window.jspdf.jsPDF;
                if (!JsPDF) throw new Error('jsPDF non disponibile');

                var doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
                var state = createPdfState(doc);
                var filename = 'Tommaso_Patriti_CV_' + cvLang.toUpperCase() + '.pdf';

                doc.setDocumentProperties({
                    title: 'Tommaso Patriti CV',
                    subject: 'Curriculum Vitae',
                    author: CV_DATA.meta.name
                });

                drawHeader(state);
                selectedSections(selectedKeys).forEach(function (section) {
                    drawSection(state, section);
                });
                drawFooters(state);

                doc.save(filename);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    // --- Logica Modal ---
    function init() {
        var openBtn = document.getElementById('openCvModal');
        var modal = document.getElementById('cvModal');
        var closeBtn = document.getElementById('closeCvModal');
        var generateBtn = document.getElementById('cvGenerate');
        var selectAllBtn = document.getElementById('cvSelectAll');

        if (!openBtn || !modal) return;

        var allSelected = true;

        // --- Language picker nel modal ---
        var langBtns = modal.querySelectorAll('.cv-lang-btn');
        for (var lb = 0; lb < langBtns.length; lb++) {
            langBtns[lb].addEventListener('click', function () {
                for (var k = 0; k < langBtns.length; k++) {
                    langBtns[k].classList.remove('active');
                }
                this.classList.add('active');
                cvLang = this.dataset.cvLang;
            });
        }

        // Apri modal
        openBtn.addEventListener('click', function () {
            allSelected = true;
            cvLang = getSiteLang();
            // Attiva il bottone lingua corretto
            for (var k = 0; k < langBtns.length; k++) {
                langBtns[k].classList.toggle('active', langBtns[k].dataset.cvLang === cvLang);
            }
            renderSectionToggles();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        // Chiudi modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Seleziona/deseleziona tutto
        selectAllBtn.addEventListener('click', function () {
            allSelected = !allSelected;
            var checkboxes = modal.querySelectorAll('input[type="checkbox"]');
            for (var i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = allSelected;
            }
            var sl = getSiteLang();
            var span = selectAllBtn.querySelector('span');
            if (span) {
                if (allSelected) {
                    span.textContent = sl === 'it' ? 'Deseleziona tutto' : 'Deselect all';
                } else {
                    span.textContent = sl === 'it' ? 'Seleziona tutto' : 'Select all';
                }
            }
        });

        // Genera PDF
        generateBtn.addEventListener('click', function () {
            var checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
            var selectedKeys = [];
            for (var i = 0; i < checkboxes.length; i++) {
                selectedKeys.push(checkboxes[i].dataset.section);
            }

            if (selectedKeys.length === 0) return;

            var sl = getSiteLang();
            var btnSpan = generateBtn.querySelector('span');
            var btnIcon = generateBtn.querySelector('i, .cv-spinner');

            // Stato loading
            generateBtn.disabled = true;
            if (btnSpan) btnSpan.textContent = sl === 'it' ? 'Generazione...' : 'Generating...';
            if (btnIcon) {
                var spinner = document.createElement('div');
                spinner.className = 'cv-spinner';
                btnIcon.replaceWith(spinner);
                btnIcon = spinner;
            }

            function restoreGenerateButton() {
                generateBtn.disabled = false;
                if (btnSpan) btnSpan.textContent = sl === 'it' ? 'Scarica PDF' : 'Download PDF';
                if (btnIcon) {
                    var icon = document.createElement('i');
                    icon.setAttribute('data-lucide', 'download');
                    btnIcon.replaceWith(icon);
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
            }

            generatePdf(selectedKeys)
                .then(restoreGenerateButton)
                .catch(function (err) {
                    console.error('Errore generazione CV PDF:', err);
                    restoreGenerateButton();
                });
        });
    }

    // --- Avvio ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
